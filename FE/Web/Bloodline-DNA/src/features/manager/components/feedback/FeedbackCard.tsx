import { Star } from 'lucide-react';
import { Card, CardContent } from '../../../staff/components/sample/ui/card';
import type { FeedbackResponse } from '../../types/feedback';

type Props = {
  feedback: FeedbackResponse;
};

const FeedbackCard: React.FC<Props> = ({ feedback }) => {
  const formattedDate = new Date(feedback.createdAt).toLocaleString();

  return (
    <Card className="overflow-hidden bg-white border border-gray-200 shadow-md rounded-xl">
      <CardContent className="p-4 space-y-2">
        {/* Top Row: User & Service */}
        <div className="flex justify-between text-sm font-semibold text-gray-700">
          <p>👤 Người dùng: {feedback.userId}</p>
          <p>🧪 Dịch vụ: {feedback.testServiceId}</p>
        </div>

        {/* Rating Row */}
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill={i < feedback.rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>

        {/* Comment Row */}
        <p className="text-base text-gray-800">{feedback.comment}</p>

        {/* Metadata Row */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>📅 Ngày gửi: {formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
