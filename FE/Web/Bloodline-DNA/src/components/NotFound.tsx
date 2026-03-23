import { Button } from "antd";
import React, { useState } from "react";
import Loading from "./Loading";

const NotFound: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleBackToHome = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1000); // Simulate a delay for the loading effect
  };

  const DNAIcon = () => (
    <div className="relative w-16 h-16 md:w-24 md:h-24">
      <svg
        className="w-full h-full text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <defs>
          <style>
            {`
              .dna-strand1 {
                animation: dna-rotate 3s linear infinite;
                transform-origin: 12px 12px;
              }
              .dna-strand2 {
                animation: dna-rotate 3s linear infinite reverse;
                transform-origin: 12px 12px;
              }
              .dna-glow {
                filter: drop-shadow(0 0 6px currentColor);
                animation: dna-pulse 2s ease-in-out infinite;
              }
              .dna-connecting {
                animation: dna-fade 1.5s ease-in-out infinite;
              }
              @keyframes dna-rotate {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
              }
              @keyframes dna-pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
              }
              @keyframes dna-fade {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 1; }
              }
            `}
          </style>
        </defs>
        <g className="dna-glow">
          {/* Left DNA Strand */}
          <g className="dna-strand1">
            <path
              d="M8 2c0 4-2 6-2 10s2 6 2 10"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <circle cx="8" cy="4" r="1.5" fill="currentColor" />
            <circle cx="6" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" />
            <circle cx="6" cy="16" r="1.5" fill="currentColor" />
            <circle cx="8" cy="20" r="1.5" fill="currentColor" />
          </g>

          {/* Right DNA Strand */}
          <g className="dna-strand2">
            <path
              d="M16 2c0 4 2 6 2 10s-2 6-2 10"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <circle cx="16" cy="4" r="1.5" fill="currentColor" />
            <circle cx="18" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="12" r="1.5" fill="currentColor" />
            <circle cx="18" cy="16" r="1.5" fill="currentColor" />
            <circle cx="16" cy="20" r="1.5" fill="currentColor" />
          </g>

          {/* Connecting Lines with Fade Animation */}
          <g className="dna-connecting">
            <line
              x1="8"
              y1="4"
              x2="16"
              y2="4"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line
              x1="6"
              y1="8"
              x2="18"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line
              x1="8"
              y1="12"
              x2="16"
              y2="12"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line
              x1="6"
              y1="16"
              x2="18"
              y2="16"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line
              x1="8"
              y1="20"
              x2="16"
              y2="20"
              stroke="currentColor"
              strokeWidth="1"
            />
          </g>
        </g>
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <DNAIcon />
        </div>
        <h1 className="mb-4 text-5xl font-bold text-gray-800 md:text-7xl animate-pulse">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 md:text-3xl">
          Trang không tìm thấy
        </h2>
        <p className="max-w-md mx-auto mb-8 text-base text-gray-600 md:text-base">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          Hãy quay lại trang chủ để tiếp tục khám phá.
        </p>
        <Button
          onClick={handleBackToHome}
          type="primary"
          size="large"
          className="px-6 py-3 transition-all duration-300 bg-blue-600 border-none shadow-lg hover:bg-blue-700 hover:shadow-xl"
        >
          Quay lại Trang chủ
        </Button>
      </div>
      {loading && (
        <Loading
          fullScreen={true}
          message="Đang quay về trang chủ..."
          size="large"
          color="blue"
        />
      )}
    </div>
  );
};

export default NotFound;
