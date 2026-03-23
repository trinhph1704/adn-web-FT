import { useCallback, useRef, useState } from "react";
import {
  getFeedbackByIdApi,
  getUserFeedbacksApi,
  type UserFeedback,
} from "../api/existingFeedbackApi";

export const useExistingFeedback = () => {
  const [existingFeedbackMap, setExistingFeedbackMap] = useState<Record<string, UserFeedback | null>>({});
  const [isCheckingFeedback, setIsCheckingFeedback] = useState<Record<string, boolean>>({});
  const [feedbackErrors, setFeedbackErrors] = useState<Record<string, string>>({});

  // Use refs to access current state without causing re-renders
  const existingFeedbackMapRef = useRef(existingFeedbackMap);
  const isCheckingFeedbackRef = useRef(isCheckingFeedback);

  // Update refs when state changes
  existingFeedbackMapRef.current = existingFeedbackMap;
  isCheckingFeedbackRef.current = isCheckingFeedback;

  const checkExistingFeedback = useCallback(
    async (userId: string, testServiceId: string) => {
      if (!userId || !testServiceId) {
        return null;
      }

      const feedbackKey = `${userId}_${testServiceId}`;

      // ⏳ Nếu đang gọi API cho key này → không gọi lại
      if (isCheckingFeedbackRef.current[feedbackKey]) {
        return existingFeedbackMapRef.current[feedbackKey] || null;
      }

      // ✅ Nếu đã có kết quả thì không gọi nữa (including null results)
      if (feedbackKey in existingFeedbackMapRef.current) {
        // console.log(`✅ Using cached feedback for ${feedbackKey}`);
        return existingFeedbackMapRef.current[feedbackKey];
      }

      try {
        setIsCheckingFeedback(prev => ({ ...prev, [feedbackKey]: true }));
        setFeedbackErrors(prev => ({ ...prev, [feedbackKey]: "" }));

        // console.log(`🔄 Checking existing feedback for ${feedbackKey}`);

        const userFeedbacksResponse = await getUserFeedbacksApi(userId);

        console.log(`🔍 API Response for user ${userId}:`, {
          success: userFeedbacksResponse.success,
          hasData: !!userFeedbacksResponse.data,
          dataType: Array.isArray(userFeedbacksResponse.data) ? 'array' : typeof userFeedbacksResponse.data,
          dataLength: Array.isArray(userFeedbacksResponse.data) ? userFeedbacksResponse.data.length : 'not-array'
        });

        if (userFeedbacksResponse.success && userFeedbacksResponse.data) {
          const feedbacks: UserFeedback[] = Array.isArray(userFeedbacksResponse.data)
            ? userFeedbacksResponse.data
            : [userFeedbacksResponse.data];

          console.log(`🔍 Processing ${feedbacks.length} feedbacks for testServiceId: ${testServiceId}`);

          const matchingFeedback = feedbacks.find(
            (feedback) => feedback.testServiceId === testServiceId
          );

          if (matchingFeedback) {
            console.log(`✅ Found matching feedback for ${feedbackKey}:`, {
              id: matchingFeedback.id,
              rating: matchingFeedback.rating,
              comment: matchingFeedback.comment ? 'has comment' : 'no comment',
              testServiceId: matchingFeedback.testServiceId
            });

            // Validation: Đảm bảo feedback có đầy đủ thông tin cần thiết
            if (!matchingFeedback.id || 
                !matchingFeedback.userId || 
                !matchingFeedback.testServiceId ||
                typeof matchingFeedback.rating !== 'number' ||
                matchingFeedback.rating < 1 || 
                matchingFeedback.rating > 5) {
              console.warn(`⚠️ Invalid feedback data for ${feedbackKey}:`, matchingFeedback);
              setExistingFeedbackMap(prev => ({
                ...prev,
                [feedbackKey]: null,
              }));
              return null;
            }

            // Lấy chi tiết nếu có
            try {
              const feedbackDetailsResponse = await getFeedbackByIdApi(matchingFeedback.id);

              if (feedbackDetailsResponse.success && feedbackDetailsResponse.data) {
                const detailedFeedback = Array.isArray(feedbackDetailsResponse.data)
                  ? feedbackDetailsResponse.data[0]
                  : feedbackDetailsResponse.data;

                console.log(`✅ Got detailed feedback for ${feedbackKey}:`, {
                  id: detailedFeedback.id,
                  rating: detailedFeedback.rating,
                  hasComment: !!detailedFeedback.comment
                });

                // Validation cho detailed feedback
                if (detailedFeedback.id && 
                    detailedFeedback.userId && 
                    detailedFeedback.testServiceId &&
                    typeof detailedFeedback.rating === 'number' &&
                    detailedFeedback.rating >= 1 && 
                    detailedFeedback.rating <= 5) {
                  setExistingFeedbackMap(prev => ({
                    ...prev,
                    [feedbackKey]: detailedFeedback,
                  }));
                  return detailedFeedback;
                } else {
                  console.warn(`⚠️ Invalid detailed feedback data for ${feedbackKey}:`, detailedFeedback);
                }
              }
            } catch (detailError) {
              console.warn("⚠️ Error getting detailed feedback:", detailError);
            }

            // Nếu không lấy được chi tiết hoặc detailed feedback không hợp lệ, dùng bản gốc (đã validated)
            setExistingFeedbackMap(prev => ({
              ...prev,
              [feedbackKey]: matchingFeedback,
            }));
            return matchingFeedback;
          } else {
            console.log(`📝 No matching feedback found for ${feedbackKey} (testServiceId: ${testServiceId})`);
            // Cache the "no feedback" result explicitly
            setExistingFeedbackMap(prev => ({
              ...prev,
              [feedbackKey]: null,
            }));
            return null;
          }
        } else {
          console.log(`📝 No feedbacks returned for user ${userId}`, {
            success: userFeedbacksResponse.success,
            message: userFeedbacksResponse.message
          });
          // Cache the "no feedback" result explicitly
          setExistingFeedbackMap(prev => ({
            ...prev,
            [feedbackKey]: null,
          }));
          return null;
        }
      } catch (error) {
        console.error(`❌ Error checking feedback for ${feedbackKey}:`, error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setFeedbackErrors(prev => ({ ...prev, [feedbackKey]: errorMessage }));
        return null;
      } finally {
        setIsCheckingFeedback(prev => ({ ...prev, [feedbackKey]: false }));
      }
    },
    [] // Remove dependencies to prevent recreation
  );

  const getExistingFeedback = useCallback(
    (userId: string, testServiceId: string): UserFeedback | null => {
      if (!userId || !testServiceId) {
        console.log("❌ getExistingFeedback: Missing userId or testServiceId", { userId, testServiceId });
        return null;
      }
      
      const feedbackKey = `${userId}_${testServiceId}`;
      
      console.log(`🔍 getExistingFeedback called for: ${feedbackKey}`, {
        userId,
        testServiceId,
        hasCachedKey: feedbackKey in existingFeedbackMap,
        cachedValue: existingFeedbackMap[feedbackKey]
      });
      
      // Chỉ trả về feedback nếu đã được cache và có giá trị thực tế
      // Không sử dụng fallback || null để tránh trả về giá trị mặc định
      if (feedbackKey in existingFeedbackMap) {
        const feedback = existingFeedbackMap[feedbackKey];
        
        // Kiểm tra kỹ càng: chỉ trả về nếu là object hợp lệ có đầy đủ fields
        if (feedback && 
            typeof feedback === 'object' && 
            feedback.id && 
            feedback.userId && 
            feedback.testServiceId &&
            typeof feedback.rating === 'number' &&
            feedback.rating >= 1 && feedback.rating <= 5) {
          
          // QUAN TRỌNG: Kiểm tra testServiceId có đúng không để tránh lẫn lộn
          if (feedback.testServiceId === testServiceId) {
            console.log(`✅ Valid feedback found for ${feedbackKey}:`, {
              id: feedback.id,
              rating: feedback.rating,
              testServiceId: feedback.testServiceId,
              userId: feedback.userId
            });
            return feedback;
          } else {
            console.warn(`⚠️ TestServiceId mismatch for ${feedbackKey}:`, {
              requestedTestServiceId: testServiceId,
              feedbackTestServiceId: feedback.testServiceId,
              feedbackId: feedback.id
            });
            return null;
          }
        } else {
          console.log(`📝 No valid feedback for ${feedbackKey} (cached as null or invalid)`);
          return null;
        }
      }
      
      console.log(`📝 No cached feedback for ${feedbackKey}`);
      return null;
    },
    [existingFeedbackMap]
  );

  const isCheckingFeedbackFor = useCallback(
    (userId: string, testServiceId: string) => {
      const feedbackKey = `${userId}_${testServiceId}`;
      return isCheckingFeedback[feedbackKey] || false;
    },
    [isCheckingFeedback]
  );

  const getFeedbackError = useCallback(
    (userId: string, testServiceId: string) => {
      const feedbackKey = `${userId}_${testServiceId}`;
      return feedbackErrors[feedbackKey] || "";
    },
    [feedbackErrors]
  );

  const clearFeedbackCache = useCallback(() => {
    console.log("🧹 Clearing all feedback cache");
    setExistingFeedbackMap({});
    setIsCheckingFeedback({});
    setFeedbackErrors({});
  }, []);

  // Debug function để clear cache cho specific booking
  const clearFeedbackCacheForBooking = useCallback((userId: string, testServiceId: string) => {
    if (!userId || !testServiceId) return;
    
    const feedbackKey = `${userId}_${testServiceId}`;
    console.log(`🧹 Clearing feedback cache for ${feedbackKey}`);
    
    setExistingFeedbackMap(prev => {
      const { [feedbackKey]: removed, ...rest } = prev;
      return rest;
    });
    setIsCheckingFeedback(prev => {
      const { [feedbackKey]: removed, ...rest } = prev;
      return rest;
    });
    setFeedbackErrors(prev => {
      const { [feedbackKey]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    checkExistingFeedback,
    getExistingFeedback,
    isCheckingFeedbackFor,
    getFeedbackError,
    clearFeedbackCache,
    clearFeedbackCacheForBooking,
    // expose raw maps if needed
    existingFeedbackMap,
    isCheckingFeedback,
    feedbackErrors,
  };
};
