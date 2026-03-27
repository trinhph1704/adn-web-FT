'use client';

import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Loading } from "@/components/shared";
import { getCurrentUserProfileApi, updateUserProfileApi } from "@/lib/api/user";

export default function EditProfilePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getCurrentUserProfileApi();
        form.setFieldsValue({
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone || "",
          address: profile.address || "",
        });
      } catch (error) {
        message.error("Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [form]);

  const handleSubmit = async (values: {
    fullName: string;
    phone?: string;
    address?: string;
  }) => {
    setSubmitting(true);
    try {
      await updateUserProfileApi({
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
      });
      message.success("Cập nhật thông tin thành công");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Cập nhật thất bại"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loading size="large" message="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-2xl sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Hồ sơ cá nhân
      </h1>

      <div className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting}
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input size="large" placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input size="large" disabled placeholder="email@example.com" />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input size="large" placeholder="0901234567" />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input.TextArea
              rows={3}
              placeholder="Địa chỉ liên hệ"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              size="large"
              className="!bg-blue-600 hover:!bg-blue-700"
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
