'use client';

import { useState, useEffect } from "react";
import { Loading } from "@/components/shared";
import api from "@/lib/api/client";

interface SampleInstruction {
  id: string;
  sampleType: number;
  title?: string;
  content?: string;
}

export default function AdminSampleInstructionsPage() {
  const [instructions, setInstructions] = useState<SampleInstruction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/sample-instructions");
        const data = res.data?.data ?? [];
        setInstructions(Array.isArray(data) ? data : []);
      } catch {
        setInstructions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loading size="large" message="Đang tải hướng dẫn lấy mẫu..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Hướng dẫn lấy mẫu
      </h1>

      <div className="space-y-4">
        {instructions.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            Chưa có hướng dẫn lấy mẫu nào.
          </p>
        ) : (
          instructions.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white border border-blue-100 rounded-lg"
            >
              <h3 className="font-semibold text-gray-800">
                Loại mẫu: {item.sampleType}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {item.title || item.content || "Nội dung hướng dẫn"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
