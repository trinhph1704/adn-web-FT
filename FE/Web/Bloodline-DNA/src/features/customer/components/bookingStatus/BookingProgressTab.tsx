import { FilePenIcon, StarIcon } from "lucide-react";
import type { BookingDetail, TestProgressData } from "../../types/bookingTypes";
import type { UserFeedback } from "../../api/existingFeedbackApi";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { formatDate } from "../utils/bookingUtils";
import { ProgressStepProps } from "./ProgressStep";
import { useFeedbackDebug } from "../../hooks/useFeedbackDebug";

interface BookingProgressTabProps {
  progressData: TestProgressData | null;
  booking: BookingDetail;
  paymentLoading: boolean;
  paymentError: string | null;
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  isSubmittingFeedback: boolean;
  feedbackSuccess: string | null;
  feedbackError: string | null;
  handleFeedbackSubmit: () => void;
  handleStepAction: (payload: any) => void;
  isSampleModalOpen: boolean;
  setIsSampleModalOpen: (open: boolean) => void;
  handleConfirmDelivery?: (bookingId: string) => void;
  confirmDeliveryLoading?: boolean;
  shouldShowSampleButton: boolean;
  isDeliveryConfirmed: boolean;
  isCollectionConfirmed: boolean;
  getExistingFeedback: (userId: string, testServiceId: string) => UserFeedback | null;
  isCheckingFeedbackFor: (userId: string, testServiceId: string) => boolean;
  userId: string | null;
  testServiceId: string | null;
  isErrorModalOpen?: boolean;
  setIsErrorModalOpen?: (open: boolean) => void;
  errorModalMessage?: string;
}

export const BookingProgressTab = ({
  progressData,
  booking,
  paymentLoading,
  paymentError,
  rating,
  setRating,
  comment,
  setComment,
  isSubmittingFeedback,
  feedbackSuccess,
  feedbackError,
  handleFeedbackSubmit,
  handleStepAction,
  setIsSampleModalOpen,
  handleConfirmDelivery,
  confirmDeliveryLoading = false,
  shouldShowSampleButton,
  isDeliveryConfirmed,
  isCollectionConfirmed,
  getExistingFeedback,
  isCheckingFeedbackFor,
  userId,
  testServiceId,
  isErrorModalOpen,
  setIsErrorModalOpen,
  errorModalMessage,
}: BookingProgressTabProps) => {


  if (!progressData) return <p>Không có dữ liệu tiến trình.</p>;

  // Get existing feedback data with strict validation
  const existingFeedback = userId && testServiceId ? getExistingFeedback(userId, testServiceId) : null;
  const isCheckingExistingFeedback = userId && testServiceId ? isCheckingFeedbackFor(userId, testServiceId) : false;

  // Additional validation to ensure we have legitimate feedback data
  const hasValidFeedback = existingFeedback && 
    typeof existingFeedback === 'object' &&
    existingFeedback.id &&
    existingFeedback.userId &&
    existingFeedback.testServiceId &&
    typeof existingFeedback.rating === 'number' &&
    existingFeedback.rating >= 1 && 
    existingFeedback.rating <= 5 &&
    // QUAN TRỌNG: Đảm bảo feedback thuộc về testServiceId hiện tại
    existingFeedback.testServiceId === testServiceId &&
    existingFeedback.userId === userId;

  // Debug logging with comprehensive analysis
  const { hasValidFeedback: debugValidFeedback, isPotentialAutoFeedback } = useFeedbackDebug({
    userId,
    testServiceId,
    bookingStatus: booking.status,
    existingFeedback,
    isCheckingFeedback: isCheckingExistingFeedback
  });

  // Debug logging
  if (booking.status === "Completed" && userId && testServiceId) {
    console.log("🔍 BookingProgressTab feedback debug:", {
      userId,
      testServiceId,
      existingFeedback: existingFeedback ? {
        id: existingFeedback.id,
        rating: existingFeedback.rating,
        hasComment: !!existingFeedback.comment,
        testServiceId: existingFeedback.testServiceId
      } : null,
      hasValidFeedback,
      debugValidFeedback,
      isPotentialAutoFeedback,
      isCheckingExistingFeedback
    });
  }

  const completedSteps = progressData.steps.filter(
    (s) => s.status === "completed"
  ).length;
  const progressPercentage = Math.round(
    (completedSteps / progressData.steps.length) * 100
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="relative flex-grow space-y-1 lg:w-2/3">
        {progressData.steps.map((step, index) => (
          <ProgressStepProps
            key={step.id}
            step={step}
            index={index}
            isLast={index === progressData.steps.length - 1}
            paymentLoading={paymentLoading}
            paymentError={paymentError}
            handleStepAction={handleStepAction}
            bookingStatus={booking.status}
            setIsSampleModalOpen={setIsSampleModalOpen}
            handleConfirmDelivery={handleConfirmDelivery}
            confirmDeliveryLoading={confirmDeliveryLoading}
            bookingId={booking.id}
            shouldShowSampleButton={shouldShowSampleButton}
            isDeliveryConfirmed={isDeliveryConfirmed}
            isCollectionConfirmed={isCollectionConfirmed}
            userId={userId}
            isErrorModalOpen={isErrorModalOpen}
            setIsErrorModalOpen={setIsErrorModalOpen}
            errorModalMessage={errorModalMessage}
          />
        ))}
      </div>
      <div className="lg:w-1/3">
        <Card className="sticky top-24">
          <CardHeader>
            <h3 className="!font-bold text-slate-800">Tổng Quan Tiến Trình</h3>
          </CardHeader>
          <CardContent>
            <div className="mb-6 text-center">
              <p className="mb-2 text-5xl font-bold text-blue-600">
                {progressPercentage}%
              </p>
              <p className="text-slate-500">Hoàn thành</p>
            </div>
            <div className="w-full h-3 mb-6 bg-gray-200 rounded-full">
              <div
                className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Bước hiện tại:</span>
                <span className="font-medium">
                  {completedSteps + 1 > progressData.steps.length
                    ? progressData.steps.length
                    : completedSteps + 1}
                  /{progressData.steps.length}
                </span>
              </div>
              <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                <p className="font-medium text-blue-800">
                  {
                    progressData.steps.find((s) => s.status === "current")
                      ?.title
                  }
                </p>
              </div>
              {progressData.expectedResultDate && (
                <div className="pt-3 border-t">
                  <p className="text-slate-600">
                    <strong>Dự kiến có kết quả:</strong>
                  </p>
                  <p className="font-medium text-green-600">
                    {formatDate(progressData.expectedResultDate)}
                  </p>
                </div>
              )}
              {progressData.trackingNumber && (
                <div className="pt-3 border-t">
                  <p className="text-slate-600">
                    <strong>Mã theo dõi:</strong>
                  </p>
                  <p className="font-mono font-medium text-blue-600">
                    {progressData.trackingNumber}
                  </p>
                </div>
              )}
            </div>
            {booking.status === "Completed" && (
              <div className="pt-4 mt-4 border-t">
                {/* Loading state while checking existing feedback */}
                {isCheckingExistingFeedback ? (
                  <div className="p-4 text-center bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-700 font-medium">Đang kiểm tra đánh giá...</span>
                    </div>
                  </div>
                ) : hasValidFeedback ? (
                  /* Display existing feedback - chỉ khi có feedback hợp lệ */
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-slate-800 mb-3">
                        Đánh giá của bạn
                      </p>
                      
                      {/* Display existing rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-6 h-6 ${
                                existingFeedback!.rating >= star
                                  ? "text-yellow-400 fill-yellow-400 stroke-black"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600">
                          ({existingFeedback!.rating}/5 sao)
                        </span>
                      </div>
                      
                      {/* Display existing comment */}
                      {existingFeedback!.comment && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm font-medium text-slate-600 mb-1">Bình luận:</p>
                          <p className="text-slate-700 leading-relaxed">
                            {existingFeedback!.comment}
                          </p>
                        </div>
                      )}
                      
                      {/* Display feedback date */}
                      <div className="mt-3 text-xs text-slate-500">
                        Đánh giá vào: {new Date(existingFeedback!.createdAt).toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium text-center">
                        ✓ Cảm ơn bạn đã đánh giá dịch vụ của chúng tôi!
                      </p>
                    </div>
                  </div>
                ) : feedbackSuccess ? (
                  /* Display success message for new feedback */
                  <div className="p-3 text-center bg-green-100 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-800">
                      {feedbackSuccess}
                    </p>
                  </div>
                ) : (
                  /* Display feedback form for new feedback */
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-slate-800">
                        Đánh giá của bạn
                      </p>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-6 h-6 cursor-pointer transition-colors ${
                              rating >= star
                                ? "text-yellow-400 fill-yellow-400 stroke-black"
                                : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="comment"
                        className="text-sm font-medium text-slate-600"
                      >
                        Bình luận
                      </label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md min-h-[80px] focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Chia sẻ cảm nhận của bạn về dịch vụ..."
                      />
                    </div>
                    {feedbackError && (
                      <p className="text-sm text-red-600">{feedbackError}</p>
                    )}
                    <Button
                      onClick={handleFeedbackSubmit}
                      disabled={isSubmittingFeedback}
                      className="w-full bg-blue-500 !text-white hover:bg-blue-600"
                    >
                      {isSubmittingFeedback ? "Đang gửi..." : "Gửi đánh giá"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
