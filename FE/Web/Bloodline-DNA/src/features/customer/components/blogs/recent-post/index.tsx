import { CalendarIcon } from "lucide-react";
import type { BlogPost } from "../../../types/blogs.types";

interface RecentPostProps {
  post: BlogPost;
  formatDate: (dateString: string) => string;
}

export const RecentPost: React.FC<RecentPostProps> = ({ post, formatDate }) => {
  return (
    <div className="flex items-start p-3 space-x-4 group rounded-2xl hover:bg-white/80">
      <div className="relative">
        <img
          src={post.thumbnailURL}
          alt={post.title}
          className="object-cover w-20 h-20 rounded-xl group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/0 to-blue-900/20 rounded-xl group-hover:from-blue-900/10 group-hover:to-blue-900/30"></div>
      </div>
      <div className="flex-1">
        <h4 className="mb-2 text-sm font-bold text-blue-900 group-hover:text-blue-700 line-clamp-2">
          {post.title}
        </h4>
        <div className="flex items-center px-2 py-1 text-xs text-blue-500 border border-gray-200 rounded-full bg-blue-50">
          <CalendarIcon className="w-3 h-3 mr-1" />
          {formatDate(post.createdAt)}
        </div>
      </div>
    </div>
  );
};
