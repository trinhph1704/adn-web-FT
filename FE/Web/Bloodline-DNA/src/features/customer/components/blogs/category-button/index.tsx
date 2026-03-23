import { TagIcon } from "lucide-react";
import type { Category } from "../../../types/blogs.types";

interface CategoryButtonProps {
  category: Category;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(category.id)}
      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
        isSelected
          ? "bg-blue-900 text-white shadow-lg"
          : "bg-blue-50 text-blue-900 hover:bg-blue-100"
      }`}
    >
      <TagIcon
        className={`w-5 h-5 mr-2 ${isSelected ? "text-white" : "text-blue-900"}`}
      />
      <span className={isSelected ? "text-white" : "text-blue-900"}>
        {category.name}
      </span>
      <span
        className={`ml-2 px-2 py-1 rounded-full text-xs ${
          isSelected ? "bg-white/20 text-white" : "bg-blue-200 text-blue-800"
        }`}
      >
        {category.count}
      </span>
    </button>
  );
};
