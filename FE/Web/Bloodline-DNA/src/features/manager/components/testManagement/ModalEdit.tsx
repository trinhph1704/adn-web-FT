import React, { useState, useEffect } from "react";
import type { TestResponse, TestUpdateRequest } from "../../types/testService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../staff/components/sample/ui/dialog";
import { Label } from "../../../staff/components/booking/ui/label";
import { Input } from "../../../staff/components/booking/ui/input";
import Checkbox from "../common/Checkbox";
import { Button } from "../../../staff/components/sample/ui/button";
import { CATEGORY_OPTIONS } from "../../utils/categoryMap";

interface ModalEditProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TestUpdateRequest) => Promise<void>;
  initialData?: TestResponse | null;
  collectionMethods?: string[];
}

const defaultCollectionMethods = ["Tự lấy mẫu", "Lấy mẫu tại cơ sở"];

const ModalEdit: React.FC<ModalEditProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  collectionMethods = defaultCollectionMethods,
}) => {
  const [form, setForm] = useState<TestResponse | null>(null);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        ...initialData,
        priceServices: initialData.priceServices?.length > 0
          ? [{ ...initialData.priceServices[0] }]
          : [],
      });
    }
  }, [initialData, open]);

  if (!form) return null;

  const price = form.priceServices[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (["price", "collectionMethod", "currency", "effectiveFrom", "effectiveTo"].includes(name)) {
      setForm(prev => prev ? {
        ...prev,
        priceServices: prev.priceServices.map((ps, idx) =>
          idx === 0
            ? {
              ...ps,
              [name]: name === "price" || name === "collectionMethod" ? Number(value) : value,
            }
            : ps
        )
      } : null);
    } else {
      setForm(prev => prev ? {
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
      } : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    const price = form.priceServices[0];

    const payload: TestUpdateRequest = {
      id: form.id,
      name: form.name,
      description: form.description,
      category: form.category,
      isActive: form.isActive,
      priceServices: [
        {
          id: price.id, // ✅ Thêm dòng này để tránh lỗi thiếu Id
          price: price.price,
          collectionMethod: price.collectionMethod,
          effectiveFrom: price.effectiveFrom,
          effectiveTo: price.effectiveTo,
          isActive: price.isActive,
          currency: price.currency || "VND"
        }
      ]
    };

    await onSubmit(payload);
    onClose();
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>Sửa dịch vụ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Tên dịch vụ</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-input rounded-md px-3 py-2 resize-y min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Loại</Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-input rounded-md px-3 py-2"
              required
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.api} value={opt.api}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Giá dịch vụ</Label>
            <Input
              type="number"
              name="price"
              value={price?.price ?? 0}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="collectionMethod">Phương thức thu</Label>
            <select
              id="collectionMethod"
              name="collectionMethod"
              value={price?.collectionMethod ?? 0}
              onChange={handleChange}
              className="w-full border border-input rounded-md px-3 py-2"
              required
            >
              {collectionMethods.map((method, idx) => (
                <option key={method} value={idx}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Hiệu lực từ</Label>
              <Input
                type="date"
                name="effectiveFrom"
                value={price?.effectiveFrom?.slice(0, 10) || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label>Hiệu lực đến</Label>
              <Input
                type="date"
                name="effectiveTo"
                value={price?.effectiveTo?.slice(0, 10) || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.isActive && price?.isActive}
              onChange={(checked: boolean) => {
                setForm(prev => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    isActive: checked,
                    priceServices: prev.priceServices.map((ps, idx) =>
                      idx === 0 ? { ...ps, isActive: checked } : ps
                    )
                  };
                });
              }}
              label="Đang áp dụng dịch vụ và bảng giá"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" className="bg-blue-600 text-white"><span className="text-white">Lưu</span></Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEdit;
