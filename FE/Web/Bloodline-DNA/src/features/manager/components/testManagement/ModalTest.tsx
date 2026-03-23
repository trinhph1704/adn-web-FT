// ✅ ModalTest.tsx - Thêm dịch vụ
import React, { useState, useEffect } from "react";
import type { PriceServiceRequest } from "../../types/testService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../staff/components/sample/ui/dialog";
import { Label } from "../../../staff/components/booking/ui/label";
import { Input } from "../../../staff/components/booking/ui/input";
import Checkbox from "../common/Checkbox";
import { Button } from "../../../staff/components/sample/ui/button";
import { CATEGORY_OPTIONS } from '../../utils/categoryMap';

interface ModalAddTestProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    sampleCount: number;
    priceService: PriceServiceRequest;
  }) => Promise<void>;
  collectionMethods?: string[];
}

const defaultTest = {
  name: "",
  description: "",
  category: "",
  isActive: true,
  sampleCount: 1,
};

const defaultPrice: PriceServiceRequest = {
  price: 0,
  collectionMethod: 0,
  effectiveFrom: "",
  effectiveTo: "",
  isActive: true,
};

const ModalTest: React.FC<ModalAddTestProps> = ({
  open,
  onClose,
  onSubmit,
  collectionMethods = ["Tự lấy mẫu", "Tại cơ sở"],
}) => {
  const [test, setTest] = useState(defaultTest);
  const [price, setPrice] = useState<PriceServiceRequest>(defaultPrice);

  useEffect(() => {
    if (open) {
      setTest(defaultTest);
      setPrice(defaultPrice);
    }
  }, [open]);

  const handleTestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setTest((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "sampleCount"
        ? Number(value)
        : value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPrice((prev) => ({
      ...prev,
      [name]: name === "price" || name === "collectionMethod"
        ? Number(value)
        : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...test, priceService: price });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Tên dịch vụ</Label>
            <Input id="name" name="name" value={test.name} onChange={handleTestChange} required />
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              name="description"
              value={test.description}
              onChange={handleTestChange}
              rows={4}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Danh mục</Label>
            <select
              id="category"
              name="category"
              value={test.category}
              onChange={handleTestChange}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.api} value={opt.api}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="sampleCount">Số mẫu cần</Label>
            <Input
              type="text"
              name="sampleCount"
              id="sampleCount"
              value={test.sampleCount}
              onChange={handleTestChange}
              min={1}
              required
            />
          </div>
          <div>
            <Label>Giá</Label>
            <Input type="text" name="price" value={price.price} onChange={handlePriceChange} required />
          </div>
          <div>
            <Label>Phương thức thu</Label>
            <select
              name="collectionMethod"
              value={price.collectionMethod}
              onChange={handlePriceChange}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              {collectionMethods.map((method, idx) => (
                <option key={idx} value={idx}>{method}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Hiệu lực từ</Label>
              <Input type="date" name="effectiveFrom" value={price.effectiveFrom} onChange={handlePriceChange} required />
            </div>
            <div className="flex-1">
              <Label>Hiệu lực đến</Label>
              <Input type="date" name="effectiveTo" value={price.effectiveTo} onChange={handlePriceChange} required />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={test.isActive}
              onChange={(checked) => {
                setTest(prev => ({ ...prev, isActive: checked }));
                setPrice(prev => ({ ...prev, isActive: checked }));
              }}
              label="Đang áp dụng"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" className="bg-blue-700 text-white"><span className="text-white">Thêm</span></Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTest;
