'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-12 bg-white md:py-16">
      <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
          Đặt lịch xét nghiệm ADN ngay hôm nay để nhận kết quả chính xác, bảo mật.
        </h2>
        <p className="mb-8 text-sm text-gray-600 md:text-base">
          Hỗ trợ 24/7 từ đội ngũ chuyên gia.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg"
          >
            Đặt lịch ngay
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-blue-600 transition-all border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white"
          >
            Liên hệ tư vấn
          </Link>
        </div>
      </div>
    </section>
  );
}

