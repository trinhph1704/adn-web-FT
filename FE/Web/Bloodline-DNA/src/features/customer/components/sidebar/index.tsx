import type { BlogPost } from "../../types/blogs.types";
import { RecentPost } from "../blogs/recent-post";


interface SidebarProps {
  blogPosts: BlogPost[];
  formatDate: (dateString: string) => string;
}

export const Sidebar = ({ blogPosts, formatDate }: SidebarProps) => {
  return (
    <div className="lg:col-span-4">
      <div className="sticky space-y-8 top-8">
        <div className="overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-white to-blue-50/50 rounded-3xl">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-8 mr-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-700"></div>
              <h3 className="text-xl font-bold text-blue-900">Bài Viết Gần Đây</h3>
            </div>
            <div className="space-y-6">
              {blogPosts.slice(0, 4).map((post) => (
                <RecentPost key={`recent-${post.id}`} post={post} formatDate={formatDate} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 