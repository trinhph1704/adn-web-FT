
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../../../components";
import Loading from "../../../components/Loading";
import { getBlogsApi } from "../api/blogApi";
import { BlogPostList } from "../components/blogs/blogPost-list";
import { FeaturedPosts } from "../components/blogs/featured-posts";
import { BlogHero } from "../components/blogs/hero";
import { BlogSearchFilter } from "../components/blogs/search";
import { Sidebar } from "../components/sidebar/index";
import type { BlogPost } from "../types/blogs.types";

export const Blogs: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const blogs = await getBlogsApi();
        const publishedBlogs = blogs
          .filter((post) => post.status === "Published")
          .map((post) => ({
            ...post,
            status: post.status as "Published" | "Draft",
          }));
        setFilteredPosts(publishedBlogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải bài viết");
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
        <div className="relative z-50">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading 
            size="large" 
            message="Đang tải danh sách blog..." 
            color="blue" 
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fcfefe] to-gray-50">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-blue-900 rounded hover:bg-blue-800"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen">
      <div className="fixed z-50 w-full">
        <Header />
      </div>
      <BlogHero isVisible={isVisible} />
      <BlogSearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FeaturedPosts filteredPosts={filteredPosts} formatDate={formatDate} />
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <BlogPostList
              filteredPosts={filteredPosts}
              formatDate={formatDate}
              setSearchTerm={setSearchTerm}
            />
            <Sidebar blogPosts={filteredPosts} formatDate={formatDate} />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};