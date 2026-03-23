import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../staff/components/sample/ui/dialog';
import { Input } from '../../../staff/components/booking/ui/input';
import { Textarea } from '../../../staff/components/booking/ui/textarea';
import { Button } from '../../../staff/components/sample/ui/button';
import type { BlogResponse } from '../../types/blogs';
import type { TagResponse } from '../../types/tags';
import Checkbox from '../common/Checkbox';
import { Loading } from '../../../../components';

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    title: string;
    content: string;
    thumbnailURL: string | File;
    thumbnailPreview: string;
    status: string;
    authorId: string;
    authorName: string;
    tagIds: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    title: string;
    content: string;
    thumbnailURL: string | File;
    thumbnailPreview: string;
    status: string;
    authorId: string;
    authorName: string;
    tagIds: string;
  }>>;
  onSave: () => void;
  editingBlog: BlogResponse | null;
  isLoading: boolean;
  tags: TagResponse[]; // ✅ Thêm prop tags
}

const BlogDialog: React.FC<BlogDialogProps> = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSave,
  editingBlog,
  isLoading,
  tags, // ✅ Dùng prop tags
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (form.thumbnailPreview) {
          URL.revokeObjectURL(form.thumbnailPreview);
        }
        setForm((prev) => ({
          ...prev,
          thumbnailURL: file,
          thumbnailPreview: URL.createObjectURL(file),
        }));
      }
    },
    [form.thumbnailPreview, setForm]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: isLoading,
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setForm({
          title: '',
          content: '',
          thumbnailURL: '',
          thumbnailPreview: '',
          status: '',
          authorId: form.authorId,
          authorName: form.authorName,
          tagIds: '',
        });
        if (form.thumbnailPreview) {
          URL.revokeObjectURL(form.thumbnailPreview);
        }
      }
      onOpenChange(isOpen);
    },
    [form.thumbnailPreview, form.authorId, form.authorName, onOpenChange, setForm]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-7xl w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-800">
            {editingBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          {/* Tiêu đề */}
          <Input
            className="w-full"
            placeholder="Tiêu đề bài viết"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            disabled={isLoading}
          />

          {/* Thumbnail */}
          <div>
            <label className="block mb-1 font-medium text-blue-800">Ảnh thumbnail</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input {...getInputProps()} />
              {isDragActive
                ? 'Thả ảnh vào đây...'
                : 'Nhấn vào đây hoặc kéo-thả ảnh vào để chọn ảnh thumbnail'}
            </div>
            {(form.thumbnailPreview || (editingBlog && typeof form.thumbnailURL === 'string')) && (
              <img
                src={
                  form.thumbnailPreview
                    ? form.thumbnailPreview
                    : typeof form.thumbnailURL === 'string'
                    ? form.thumbnailURL
                    : ''
                }
                alt="Thumbnail preview"
                className="mt-2 rounded max-h-40 object-contain border"
              />
            )}
          </div>

          {/* Nội dung */}
          <Textarea
            className="w-full"
            placeholder="Nội dung bài viết"
            rows={10}
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            disabled={isLoading}
          />

          {/* Dropdown chọn Tag */}
          <div>
            <label className="block mb-1 font-medium text-blue-800">Chọn thẻ (Tag)</label>
            <select
              value={form.tagIds}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tagIds: e.target.value,
                }))
              }
              disabled={isLoading}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- Chọn thẻ --</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.status === 'Hiển thị' || form.status === '1'}
              onChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  status: checked ? 'Hiển thị' : 'Ẩn',
                }))
              }
              label="Hiển thị (Công khai)"
              disabled={isLoading}
            />
          </div>

          {/* Nút lưu */}
          <Button
            onClick={onSave}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loading size="small" message="Đang xử lý..." color="white" />
            ) : editingBlog ? (
              'Lưu thay đổi'
            ) : (
              'Thêm bài viết'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDialog;
