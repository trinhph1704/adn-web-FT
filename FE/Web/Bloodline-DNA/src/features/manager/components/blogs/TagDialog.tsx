import { X } from 'lucide-react';
import { Button } from '../../../staff/components/sample/ui/button';

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: { name: string };
  setForm: (form: { name: string }) => void;
  editingTag: boolean;
  isLoading: boolean;
}

const TagDialog: React.FC<TagDialogProps> = ({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  editingTag,
  isLoading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-900">
          {editingTag ? 'Sửa Tag' : 'Thêm Tag'}
        </h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="tag-name" className="block text-sm font-medium text-gray-700">
              Tên tag
            </label>
            <input
              id="tag-name"
              name="name"
              type="text"
              value={form.name}
              onChange={e => setForm({ name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isLoading}>
              <span className='text-white'>{editingTag ? 'Lưu' : 'Thêm'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagDialog;