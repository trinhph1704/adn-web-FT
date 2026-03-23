import { SearchIcon } from "lucide-react";

interface BlogSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const BlogSearchFilter: React.FC<BlogSearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, tác giả, chủ đề..."
              className="w-full py-4 pl-12 pr-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
