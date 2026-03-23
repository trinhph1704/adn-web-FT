import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById, getBlogsApi } from "../api/blogApi";
import type { BlogPost } from "../types/blogs.types";

function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogAndRelated = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (id) {
          const currentBlog = await getBlogById(id);
          setBlog(currentBlog);

          const allBlogs = await getBlogsApi();
          const publishedBlogs = allBlogs
            .filter((post) => post.status === "Published" && post.id !== id)
            .map((post) => ({
              ...post,
              status: post.status as "Published" | "Draft",
            }));

          // Get related posts (maximum 5 posts excluding current post)
          const related = publishedBlogs.slice(0, 5);
          setRelatedBlogs(related);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Không thể tải bài viết");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogAndRelated();
  }, [id]);

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

  // Only show "not found" if we're not loading and there's no error but also no blog
  if (!isLoading && !error && !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="p-8 text-center bg-white shadow-lg rounded-xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Không tìm thấy bài viết
          </h2>
          <p className="text-gray-600">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  // Only render content if we have a blog (this ensures blog is not null)
  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Back to Blog Button */}
      <div className="fixed z-50 mt-5 ml-5 text-center">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-3 py-2 space-x-2 text-gray-700 transition-all duration-300 bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl hover:border-blue-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm">Quay lại trang bài viết</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <img
          src={blog.thumbnailURL}
          alt={blog.title}
          className="w-full h-[60vh] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              {blog.title}
            </h1>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium">{blog.authorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl px-6 py-12 mx-auto">
        <article className="overflow-hidden bg-white shadow-xl rounded-2xl">
          <div className="p-8 md:p-12">
            {/* Author Info Bar */}
            <div className="flex items-center justify-between p-6 mb-8 border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                  <span className="text-lg font-bold text-white">
                    {blog.authorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {blog.authorName}
                  </h3>
                  <p className="text-sm text-gray-600">Tác giả</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Ngày đăng</p>
                <p className="text-sm text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
                {blog.content}
              </div>
            </div>

            {/* Social Share Section */}
            <div className="pt-8 mt-12 border-t border-gray-200">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Chia sẻ bài viết
              </h3>
              <div className="flex flex-row gap-2 space-x-4">
                <button
                  style={{ color: "white" }}
                  className="flex items-center px-4 py-2 space-x-2 transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  <span>Twitter</span>
                </button>
                <button
                  style={{ color: "white" }}
                  className="flex items-center px-4 py-2 space-x-2 transition-colors bg-blue-800 rounded-lg cursor-pointer hover:bg-blue-900"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
                <button
                  style={{ color: "white" }}
                  className="flex items-center px-4 py-2 space-x-2 transition-colors bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span>Sao chép link</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        <div className="mt-16">
          <div className="p-8 bg-white shadow-xl rounded-2xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-800">
              Bài viết đề xuất
            </h2>

            {relatedBlogs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((relatedBlog) => (
                  <div
                    key={relatedBlog.id}
                    className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl hover:shadow-lg hover:border-blue-300 group"
                    onClick={() =>
                      (window.location.href = `/blogs/${relatedBlog.id}`)
                    }
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedBlog.thumbnailURL}
                        alt={relatedBlog.title}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 bg-black/0 group-hover:bg-black/10"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="mb-3 text-lg font-semibold text-gray-800 transition-colors line-clamp-2 group-hover:text-blue-600">
                        {relatedBlog.title}
                      </h3>

                      <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                        {relatedBlog.content?.substring(0, 120)}...
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-blue-600 rounded-full">
                            {relatedBlog.authorName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-600">
                            {relatedBlog.authorName}
                          </span>
                        </div>

                        <span className="text-xs text-gray-500">
                          {new Date(relatedBlog.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-700">
                  Chưa có bài viết đề xuất
                </h3>
                <p className="text-gray-500">
                  Hiện tại chưa có bài viết liên quan để hiển thị.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;