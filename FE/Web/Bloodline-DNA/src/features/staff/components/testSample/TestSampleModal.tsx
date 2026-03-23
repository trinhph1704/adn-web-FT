import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Input } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { getUserInfoApi } from "../../../auth/api/loginApi";
import { getTestBookingApi } from "../../api/testBookingApi";
import { createTestSampleFromStaffApi } from "../../api/testSampleApi";
import { RelationshipToSubjectLabelVi, SampleTypeLabelVi } from "../../types/sampleTest";
import type { TestBookingResponse } from "../../types/testBooking";
import type { TestKitResponse } from "../../types/testKit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../booking/ui/select";
import { Button } from "../sample/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../sample/ui/dialog";

const createAtFacilitySchema = (existingDonorNames: string[]) => {
  return z.object({
    bookingId: z.string().min(1, "Vui lòng chọn Booking"),
    donorName: z.string()
      .min(1, "Vui lòng nhập tên người cho mẫu")
      .refine((val) => !existingDonorNames.includes(val), {
        message: "Tên người cho mẫu đã tồn tại",
      }),
    relationshipToSubject: z.string().min(1, "Chọn mối quan hệ"),
    sampleType: z.string().min(1, "Chọn loại mẫu"),
    collectedById: z.string().min(1, "Nhập người thu mẫu"),
    collectedAt: z.date({ required_error: "Chọn ngày thu mẫu" }),
  });
};

type Props = {
  open: boolean;
  onClose: () => void;
  bookingId?: string | null;
  onSampleCreated?: () => void;
  existingDonorNames: string[];
};

export default function TestSampleModal({ open, onClose, bookingId, onSampleCreated, existingDonorNames }: Props) {
  const [kits] = useState<TestKitResponse[]>([]);
  const [bookings, setBookings] = useState<TestBookingResponse[]>([]);
  const [collectedById, setCollectedById] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(createAtFacilitySchema(existingDonorNames)),
    defaultValues: {
      bookingId: bookingId || "",
      collectedAt: new Date(),
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        bookingId: bookingId || "",
        collectedAt: new Date(),
      });

      const fetchUser = async () => {
        const token = localStorage.getItem("token") || "";
        if (!token) return;
        try {
          const user = await getUserInfoApi(token);
          setCollectedById(user.id);
          setValue("collectedById", user.id);
        } catch {
          toast.error("Không lấy được thông tin người dùng!");
        }
      };
      fetchUser();
    }

    const fetchBookings = async () => {
      try {
        const res = await getTestBookingApi();
        setBookings(res);
      } catch {
        toast.error("Lỗi khi tải danh sách booking");
      }
    };

    if (open) fetchBookings();
  }, [open, reset, bookingId, setValue]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token") || "";
    if (!token) return;

    // Đếm số mẫu đã tạo cho booking này
    const currentBookingId = bookingId || data.bookingId;
    const countForBooking = existingDonorNames.length;
    if (countForBooking >= 2) {
      toast.error("Bạn đã tạo 2 mẫu, không thể tạo thêm nữa");
      setIsSubmitting(false);
      return;
    }

    const selectedBooking = bookings.find(b => b.id === currentBookingId);
    if (!selectedBooking) {
      toast.error("Không tìm thấy booking đã chọn!");
      setIsSubmitting(false);
      return;
    }

    if (!selectedBooking.kitId) {
      toast.error("Booking không có KitId được chỉ định!");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      kitId: selectedBooking.kitId,
      donorName: data.donorName.trim(),
      relationshipToSubject: Number(data.relationshipToSubject),
      sampleType: Number(data.sampleType),
      labReceivedAt: new Date(),
      collectedAt: data.collectedAt,
      collectedById: collectedById || data.collectedById,
    };

    try {
      await createTestSampleFromStaffApi(payload, token);
      toast.success("Tạo mẫu thành công");
      reset();
      onClose();
      if (onSampleCreated) onSampleCreated();
    } catch (error: any) {
      console.error("❌ Lỗi:", error);
      toast.error(error.response?.data?.message || "Tạo mẫu thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm Mẫu Xét Nghiệm</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          {/* Người thu mẫu */}
          <div>
            <label className="block mb-1 text-sm">Người thu mẫu</label>
            <Input value={collectedById} readOnly className="h-10 bg-gray-100" />
          </div>

          <FormFields control={control} errors={errors} existingDonorNames={existingDonorNames} />

          {/* Ngày thu mẫu */}
          <div>
            <label className="block mb-1 text-sm">Ngày thu mẫu</label>
            <Controller
              name="collectedAt"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="w-full"
                  value={field.value ? dayjs(field.value) : null}
                  format="YYYY-MM-DD"
                  onChange={(date) => field.onChange(date?.toDate())}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 bg-[#1F2B6C] hover:bg-blue-800"
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            <span className="text-white">
              {isSubmitting ? "Đang xử lý..." : "Thêm mẫu"}
            </span>
          </Button>

          {Object.keys(errors).length > 0 && (
            <div className="p-2 text-sm text-red-500 border border-red-200 rounded bg-red-50">
              Vui lòng kiểm tra lại các thông tin bắt buộc
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  control: any;
  errors: any;
  existingDonorNames: string[];
};

function FormFields({ control, errors, existingDonorNames }: FieldProps) {
  return (
    <>
      {/* Người cho mẫu */}
      <div>
        <label className="block mb-1 text-sm">Người cho mẫu</label>
        <Controller
          name="donorName"
          control={control}
          render={({ field }) => (
            <>
              <Input
                {...field}
                placeholder="Người cho mẫu"
                className="h-10"
                status={errors.donorName ? "error" : undefined}
              />
              {errors.donorName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.donorName.message}
                  {errors.donorName.type === "refine" && (
                    <span className="block">Các tên đã tồn tại: {existingDonorNames.join(", ")}</span>
                  )}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Mối quan hệ */}
      <div>
        <label className="block mb-1 text-sm">Mối quan hệ</label>
        <Controller
          name="relationshipToSubject"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn mối quan hệ" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RelationshipToSubjectLabelVi).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.relationshipToSubject && (
          <p className="mt-1 text-sm text-red-500">{errors.relationshipToSubject.message}</p>
        )}
      </div>

      {/* Loại mẫu */}
      <div>
        <label className="block mb-1 text-sm">Loại mẫu</label>
        <Controller
          name="sampleType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn loại mẫu" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SampleTypeLabelVi).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.sampleType && (
          <p className="mt-1 text-sm text-red-500">{errors.sampleType.message}</p>
        )}
      </div>
    </>
  );
}