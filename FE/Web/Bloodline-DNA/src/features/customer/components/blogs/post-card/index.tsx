import { CalendarIcon, ShareIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import Loading from "../../../../../components/Loading";
import type { BlogPost } from "../../../types/blogs.types";

interface PostCardProps {
  post: BlogPost;
  formatDate: (dateString: string) => string;
  isFeatured: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  formatDate,
  isFeatured,
}) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleReadMore = async () => {
    setIsNavigating(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const basePath = user?.role === "Client" ? "/customer" : "";
      // Tăng delay để user thấy loading rõ hơn
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate(`${basePath}/blogs/${post.id}`);
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyLink = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const basePath = user?.role === "Client" ? "/customer" : "";
    const blogUrl = `${window.location.origin}${basePath}/blogs/${post.id}`;
    
    try {
      await navigator.clipboard.writeText(blogUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div
      className={`overflow-hidden bg-white transition-all duration-300 ${
        isFeatured
          ? "border-0 hover:shadow-2xl hover:-translate-y-2"
          : "border-2 border-gray-200 hover:shadow-xl hover:border-gray-300 rounded-2xl hover:-translate-y-1"
      }`}
    >
      <div className={isFeatured ? "" : "flex flex-col md:flex-row"}>
        {/* Ảnh */}
        <div
          className={`relative ${
            isFeatured ? "h-64" : "h-48 md:w-64 md:h-48"
          } overflow-hidden`}
        >
          <img
            src={post.thumbnailURL}
            alt={post.title}
            className={`object-cover w-full h-full transition-transform duration-300 ${
              isFeatured ? "hover:scale-110" : "hover:scale-105"
            }`}
          />
        </div>

        {/* Nội dung */}
        <div
          className={`p-${
            isFeatured ? "6" : "5"
          } flex flex-col justify-between ${isFeatured ? "" : "flex-1"}`}
        >
          <div>
            <h3
              className={`mb-3 text-${
                isFeatured ? "xl" : "lg md:text-xl"
              } font-bold text-blue-900 line-clamp-2`}
            >
              {post.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-3">
              {post.content}
            </p>
          </div>

          <div className="flex items-center mb-4">
            <p
              className={`text-${isFeatured ? "sm" : "xs"} font-${
                isFeatured ? "semibold" : "bold"
              } text-blue-900`}
            >
              {post.authorName}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Nút Đọc thêm */}
            <button
              onClick={handleReadMore}
              disabled={isNavigating}
              style={{
                color: "white",
              }}
              className={`bg-blue-900 text-sm py-2 px-5 rounded-xl transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isNavigating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang tải...
                </>
              ) : (
                "Đọc Thêm"
              )}
            </button>

            {/* Nút Chia sẻ */}
            <button
              onClick={handleShare}
              className={`group border border-blue-900 text-blue-900 text-sm py-2 px-5 rounded-xl flex items-center justify-center gap-1 transition-all duration-200 hover:bg-blue-700 hover:text-white`}
            >
              <ShareIcon className="w-4 h-4 transition-all duration-200 group-hover:text-white" />
              <span className="transition-all duration-200 group-hover:text-white">
                Chia Sẻ
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal - Sử dụng createPortal để render ở body level */}
      {showShareModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-blue-900">Chia sẻ bài viết</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Blog preview */}
            <div className="flex items-start gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
              <img 
                src={post.thumbnailURL} 
                alt={post.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 line-clamp-2 mb-2 text-lg">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600">
                  Bởi {post.authorName}
                </p>
              </div>
            </div>

            {/* Link section */}
            <div className="space-y-4">
              <label className="block text-base font-medium text-gray-700">
                Đường link bài viết:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={(() => {
                    const user = JSON.parse(localStorage.getItem("user") || "null");
                    const basePath = user?.role === "Client" ? "/customer" : "";
                    return `${window.location.origin}${basePath}/blogs/${post.id}`;
                  })()}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyLink}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    linkCopied 
                      ? "bg-green-100 text-green-700 border border-green-300" 
                      : "bg-blue-900 text-white hover:bg-blue-800"
                  }`}
                >
                  {linkCopied ? (
                    <>
                      <CheckIcon className="w-4 h-4 !text-green-700" />
                      <span className="text-green-700">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-4 h-4 !text-white" />
                      <span className="text-white">Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Fullscreen Loading khi đang navigate */}
      {isNavigating && createPortal(
        <Loading
          fullScreen={true}
          message="Đang tải chi tiết bài viết..."
          size="large"
          color="blue"
        />,
        document.body
      )}
    </div>
  );
};
