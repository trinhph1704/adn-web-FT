'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden md:py-24 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex flex-col items-center px-4 mx-auto md:flex-row max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:w-1/2 md:text-left md:mb-0">
          <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-800 md:text-4xl lg:text-5xl">
            Kết nối gia đình qua <br />
            <span className="text-blue-600">Xét nghiệm ADN</span>
          </h1>
          <p className="max-w-lg mb-8 text-sm text-gray-600 md:text-base">
            Xác định quan hệ huyết thống với độ chính xác 99.99%. Kết quả nhanh,
            bảo mật tuyệt đối, hỗ trợ tận tình.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center px-6 py-3 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg"
          >
            Đặt lịch xét nghiệm
          </Link>
        </div>
        <div className="flex justify-center md:w-1/2">
          <div className="relative">
            <div className="flex items-center justify-center w-64 h-64 rounded-full md:w-80 md:h-80 bg-blue-600/10">
              <svg
                className="text-blue-600 w-36 h-36 md:w-48 md:h-48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <g className="dna-glow">
                  <path d="M8 2c0 4-2 6-2 10s2 6 2 10" strokeLinecap="round" />
                  <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                  <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="6" cy="16" r="1.5" fill="currentColor" />
                  <circle cx="8" cy="20" r="1.5" fill="currentColor" />
                  <path d="M16 2c0 4 2 6 2 10s-2 6-2 10" strokeLinecap="round" />
                  <circle cx="16" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="18" cy="8" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="18" cy="16" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="20" r="1.5" fill="currentColor" />
                  <line x1="8" y1="4" x2="16" y2="4" stroke="currentColor" strokeWidth="1" opacity="0.8" />
                  <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.8" />
                  <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.8" />
                  <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.8" />
                  <line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.8" />
                </g>
              </svg>
            </div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full md:w-16 md:h-16 bg-blue-400/20 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full md:w-12 md:h-12 bg-blue-200/20 animate-pulse" />
            <div className="absolute w-8 h-8 rounded-full md:w-10 md:h-10 top-1/3 right-1/3 bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

