import type { BlogPost } from "../../../types/blogs.types";
import { PostCard } from "../post-card";


interface FeaturedPostsProps {
  filteredPosts: BlogPost[];
  formatDate: (dateString: string) => string;
}

export const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  filteredPosts,
  formatDate,
}) => {
  // Show the most recent published post as featured
  const featuredPosts = filteredPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 1);

  if (!featuredPosts.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-blue-900 md:text-3xl lg:text-4xl">
          Bài Viết Nổi Bật
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} formatDate={formatDate} isFeatured={true} />
          ))}
        </div>
      </div>
    </section>
  );
};