import { MoreVertical } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Loading } from '../../../components';
import { Button } from '../../staff/components/sample/ui/button';
import {
  Card,
  CardContent,
} from '../../staff/components/sample/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../staff/components/sample/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../staff/components/sample/ui/table';
import { createTagApi, deleteTagApi, getTagsApi, updateTagApi } from '../api/tagApi';
import TagDialog from '../components/blogs/TagDialog';
import type { TagRequest, TagResponse, TagUpdateRequest } from '../types/tags';

function Tags() {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<TagResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<{ name: string }>({ name: '' });

  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const tagsData = await getTagsApi();
      setTags(Array.isArray(tagsData) ? tagsData : []);
    } catch {
      alert('Không thể tải danh sách tag');
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      if (editingTag) {
        const tagRequest: TagUpdateRequest = { id: editingTag.id, name: form.name };
        await updateTagApi(tagRequest);
        setTags((prev) =>
          prev.map((tag) => (tag.id === editingTag.id ? { ...tag, name: form.name } : tag))
        );
        alert('Cập nhật tag thành công');
      } else {
        const tagRequest: TagRequest = { name: form.name };
        await createTagApi(tagRequest);
        await fetchTags();
        alert('Tạo tag thành công');
      }
      setShowDialog(false);
      setEditingTag(null);
      setForm({ name: '' });
    } catch (error: any) {
      alert(error.message || (editingTag ? 'Cập nhật tag thất bại' : 'Tạo tag thất bại'));
    } finally {
      setIsLoading(false);
    }
  }, [form, editingTag, fetchTags]);

  const handleEdit = (tag: TagResponse) => {
    setEditingTag(tag);
    setForm({ name: tag.name });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa tag này?')) {
      try {
        setIsLoading(true);
        await deleteTagApi(id);
        setTags((prev) => prev.filter((t) => t.id !== id));
        alert('Xóa tag thành công');
      } catch (error: any) {
        alert(error.message || 'Xóa tag thất bại');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddNewTag = () => {
    setForm({ name: '' });
    setEditingTag(null);
    setShowDialog(true);
  };

  return (
    <>
      <div className="min-h-screen bg-blue-50">
        <div className="fixed z-50 flex items-center justify-between p-4 px-5 bg-white w-296">
          <li className="text-lg text-[#1F2B6C]">
            Quản lý Tag</li>
          <Button
            onClick={handleAddNewTag}
            className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 px-4 py-2 text-white shadow rounded-md"
            disabled={isLoading}
          >
            <FaPlus className="text-sm text-white" />
            <span className="text-sm text-white">Thêm tag</span>
          </Button>
        </div>
        <div className='p-2 pt-19'>
          <Card className="border shadow-md rounded-2xl">
            <CardContent>
              {/* Bảng */}
              {isLoading ? (
                <div className="flex items-center justify-center h-[550px]">
                  <Loading message="Đang tải danh sách đánh giá..." />
                </div>) : tags.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold text-center">Tên</TableHead>
                          <TableHead className="font-bold text-center">Ngày tạo</TableHead>
                          <TableHead className="font-bold text-center">Ngày cập nhật</TableHead>
                          <TableHead className="font-bold text-center">Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tags.map((tag) => (
                          <TableRow key={tag.id}>
                            <TableCell className="font-semibold text-center text-blue-800">{tag.name}</TableCell>
                            <TableCell className="text-sm text-center text-gray-600">
                              {tag.createdAt ? new Date(tag.createdAt).toLocaleString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-sm text-center text-gray-600">
                              {tag.updatedAt ? new Date(tag.updatedAt).toLocaleString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-5 h-5 text-blue-700" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                  <DropdownMenuItem onClick={() => handleEdit(tag)}>
                                    ✏️ <span className="ml-1">Sửa</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(tag.id)}
                                    className="text-red-600"
                                  >
                                    🗑️ <span className="ml-1">Xóa</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                <p className="italic text-center text-gray-500">Không có tag nào để hiển thị.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog */}
      <TagDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleSave}
        form={form}
        setForm={setForm}
        editingTag={!!editingTag}
        isLoading={isLoading}
      />
    </>
  );
}

export default Tags;
