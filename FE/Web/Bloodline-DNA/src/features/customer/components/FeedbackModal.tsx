import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../staff/components/booking/ui/dialog";
import { Button } from "./ui/Button";
import { StarIcon, CheckCircle, Loader2 } from "lucide-react";
import { submitFeedbackApi, type FeedbackPayload } from "../api/feedbackApi";
import { getUserInfoApi } from "../api/userApi";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  testServiceId?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  testServiceId,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user info when modal opens
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isOpen) {
        try {
          const userInfo = await getUserInfoApi();
          setUserId(userInfo.id);
        } catch (error) {
          console.error('Error fetching user info:', error);
          setFeedbackError('Không thể lấy thông tin người dùng');
        }
      }
    };

    fetchUserInfo();
  }, [isOpen]);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setRating(0);
      setComment('');
      setFeedbackSuccess(null);
      setFeedbackError(null);
    }
  }, [isOpen]);

  const handleFeedbackSubmit = async () => {
    if (!userId) {
      setFeedbackError('Thiếu thông tin người dùng');
      return;
    }
    if (rating === 0) {
      setFeedbackError('Vui lòng chọn số sao đánh giá');
      return;
    }
    if (!comment.trim()) {
      setFeedbackError('Vui lòng nhập bình luận');
      return;
    }

    setIsSubmittingFeedback(true);
    setFeedbackError(null);

    const payload: FeedbackPayload = {
      userId,
      testServiceId: testServiceId || bookingId, // Use testServiceId if provided, otherwise use bookingId
      rating,
      comment: comment.trim(),
    };

    try {
      const res = await submitFeedbackApi(payload);
      if (res.success) {
        setFeedbackSuccess('Gửi đánh giá thành công!');
        setRating(0);
        setComment('');
        // Auto close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Lỗi khi gửi đánh giá');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">Đánh giá dịch vụ</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {feedbackSuccess ? (
            <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-800">{feedbackSuccess}</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium block mb-2">Đánh giá của bạn *</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-colors ${
                        rating >= star ? 'text-yellow-400 fill-yellow-400 stroke-black' : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Bạn đã chọn {rating} sao
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="comment" className="text-sm font-medium block mb-2">Bình luận *</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Chia sẻ cảm nhận của bạn về dịch vụ..."
                />
              </div>

              {feedbackError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{feedbackError}</p>
                </div>
              )}
            </>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              {feedbackSuccess ? 'Đóng' : 'Hủy'}
            </Button>
          </DialogClose>
          {!feedbackSuccess && (
            <Button 
              onClick={handleFeedbackSubmit} 
              disabled={isSubmittingFeedback || rating === 0}
              className="!text-white !bg-blue-900"
            >
              {isSubmittingFeedback ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-white" />
                  Gửi đánh giá
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 