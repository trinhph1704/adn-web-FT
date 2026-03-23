import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../staff/components/sample/ui/dialog";
import { Badge } from "../../../staff/components/booking/ui/badge";
import {
    getCategoryLabel,
    type TestResponse,
} from "../../types/testService";
import {
    Banknote,
    BadgeCheck,
    CalendarDays,
    Info,
    Tag,
} from "lucide-react";

interface ModalDetailProps {
    open: boolean;
    onClose: () => void;
    test: TestResponse | null;
}

const ModalDetail: React.FC<ModalDetailProps> = ({ open, onClose, test }) => {
    if (!test) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl w-full rounded-2xl px-6 py-8">
                <DialogHeader>
                    <DialogTitle className="text-rose-600 flex items-center gap-2 text-2xl">
                        <Info className="text-black" />
                        <span className="text-black">Chi tiết dịch vụ</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Tag size={18} /> Tên dịch vụ
                        </div>
                        <div className="text-xl font-semibold text-foreground">{test.name}</div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BadgeCheck size={18} /> Loại
                        </div>
                        <div className="text-xl font-semibold">{getCategoryLabel(test.category)}</div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info size={18} /> Mô tả
                        </div>
                        <div className="text-base text-gray-700">{test.description}</div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BadgeCheck size={18} /> Trạng thái
                        </div>
                        <Badge
                            variant={test.isActive ? "default" : "secondary"}
                            className={
                                test.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-rose-100 text-rose-800"
                            }
                        >
                            {test.isActive ? "Đang áp dụng" : "Ngừng"}
                        </Badge>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays size={18} /> Ngày tạo
                        </div>
                        <div className="text-base">{new Date(test.createdAt).toLocaleString()}</div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays size={18} /> Ngày cập nhật
                        </div>
                        <div className="text-base">{new Date(test.updatedAt).toLocaleString()}</div>
                    </div>
                </div>

                <div className="mt-10">
                    <div className="text-xl font-semibold text-rose-600 flex items-center gap-2 mb-4">
                        <Banknote size={22} className="text-green-700" /> 
                            <span className="text-black">Bảng giá</span>

                    </div>

                    <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
                        {test.priceServices.map((ps) => (
                            <div
                                key={ps.id}
                                className="rounded-2xl bg-white border border-rose-100 shadow-md hover:shadow-lg transition-all p-5 flex flex-col justify-between"
                            >
                                {/* Giá và tiền */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-green-100 text-green-700 rounded-full">
                                        <Banknote size={24} />
                                    </div>
                                    <div className="text-2xl font-bold text-green-700">
                                        {ps.price.toLocaleString()} {ps.currency}
                                    </div>
                                </div>

                                {/* Chi tiết */}
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="flex items-start gap-2">
                                        <BadgeCheck size={16} className="mt-0.5 text-blue-500" />
                                        <span>
                                            <strong>Phương thức thu:</strong>{" "}
                                            {ps.collectionMethod === 0 ? "Trực tiếp" : "Khác"}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CalendarDays size={16} className="mt-0.5 text-rose-500" />
                                        <span>
                                            <strong>Hiệu lực:</strong>{" "}
                                            {new Date(ps.effectiveFrom).toLocaleDateString()} -{" "}
                                            {new Date(ps.effectiveTo).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default ModalDetail;
