import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '../../../staff/components/sample/ui/button';
import { Card, CardContent } from '../../../staff/components/sample/ui/card';
import type { BlogResponse } from '../../types/blogs';

interface BlogCardProps {
  blog: BlogResponse;
  onEdit: (blog: BlogResponse) => void;
  onDelete: (id: string) => void;
}

const getStatusText = (status: string) => {
  if (status === '1') return 'Công khai';
  if (status === '0') return 'Bản nháp';
  return status;
};

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => (
  <Card className="relative border border-blue-100 shadow-md">
    <CardContent className="flex flex-col space-y-3">
      <img
        src={blog.thumbnailURL}
        alt={blog.title}
        className="object-cover w-full rounded-md h-70"
      />
      <h2 className="text-sm font-semibold text-blue-700 truncate" title={blog.title}>
        {blog.title}
      </h2>

      {/* Hiển thị Tag (nếu có) */}
      {blog.tagName && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
            {blog.tagName}
          </span>
        </div>
      )}

      <p className="text-xs text-gray-600">
        Trạng thái: <span className="font-medium">{getStatusText(blog.status)}</span>
      </p>
      <p className="text-xs text-gray-600">
        Tác giả: <span className="font-medium">{blog.authorName}</span>
      </p>
      <p className="text-xs text-gray-500">
        Ngày tạo: {format(new Date(blog.createdAt), 'dd/MM/yyyy')}
      </p>

      <div className="flex gap-3 pt-2">
        <Button
          size={"icon"}
          style={{ fontSize: "12px" }}
          variant="outline"
          className="flex items-center flex-1 gap-2 text-blue-700 border-blue-600 hover:bg-blue-50"
          onClick={() => onEdit(blog)}
        >
          <FaEdit color='blue' size={10} /> Sửa
        </Button>
        <Button
          size={"icon"}
          style={{ fontSize: "12px" }}
          variant="outline"
          className="flex items-center flex-1 gap-2 text-red-600 border-red-500 hover:bg-red-50"
          onClick={() => onDelete(blog.id)}
        >
          <FaTrash color='red' size={10} /> Xóa
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default BlogCard;
