import { useCallback, useEffect, useState } from 'react';
import { Loading } from '../../../components';
import { getFeedbacksApi } from '../api/feedbackApi'; // Thêm dòng này
import FeedbackCard from '../components/feedback/FeedbackCard';
import type { FeedbackResponse } from '../types/feedback';

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Đổi sang gọi API thật
  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFeedbacksApi();
      setFeedbacks(data);
    } catch {
      setFeedbacks([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return (
    <>
      <div className="relative flex flex-col items-center h-screen overflow-auto bg-blue-50">
        <div className="w-full">
          <div className="fixed flex items-center justify-between w-full p-5 px-5 bg-white">
            <li className="text-lg text-[#1F2B6C]">
              Quản lí đánh giá phản hồi
            </li>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-[550px]">
              <Loading message="Đang tải danh sách đánh giá..." />
            </div>
          ) : feedbacks.length > 0 ? (
            <div className="p-2 space-y-4 mt-17">
              {feedbacks.map((fb) => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Không có phản hồi nào để hiển thị.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Feedbacks;
