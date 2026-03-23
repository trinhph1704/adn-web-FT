import { BookmarkIcon } from "lucide-react";
import type { BlogPost } from "../../../types/blogs.types";
import { Button } from "../../ui/Button";
import { PostCard } from "../post-card";

interface BlogPostListProps {
  filteredPosts: BlogPost[];
  formatDate: (dateString: string) => string;
  setSearchTerm: (term: string) => void;
}

export const BlogPostList: React.FC<BlogPostListProps> = ({
  filteredPosts,
  formatDate,
  setSearchTerm,
}) => {
  return (
    <div className="lg:col-span-8">
      <div className="mb-8">
        <p className="text-lg text-slate-600">
          Tìm thấy <span className="font-semibold text-blue-900">{filteredPosts.length}</span> bài viết
        </p>
      </div>
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} formatDate={formatDate} isFeatured={false} />
        ))}
      </div>
      {filteredPosts.length === 0 && (
        <div className="py-16 text-center">
          <BookmarkIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-slate-600">Không tìm thấy bài viết</h3>
          <p className="text-slate-500">Vui lòng thử lại với từ khóa khác</p>
          <Button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-white bg-blue-900 hover:bg-blue-800"
          >
            Đặt Lại Bộ Lọc
          </Button>
        </div>
      )}
    </div>
  );
};
