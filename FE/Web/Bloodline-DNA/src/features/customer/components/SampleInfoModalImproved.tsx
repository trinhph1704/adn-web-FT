import React, { useState, useEffect } from 'react';
import { AlertCircleIcon, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../staff/components/booking/ui/dialog';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader } from './ui/Card';
import {
  getTestKitByBookingIdApi,
  submitSampleInfoApi,
  getTestSampleByKitIdApi,
  type SampleInfoPayload,
  type TestSampleInfo,
} from '../api/sampleApi';
import { getBookingByIdApi } from '../api/bookingListApi';
import { 
  RelationshipToSubjectLabelViByKey, 
  SampleTypeLabelViByKey,
  RelationshipToSubjectLabelVi,
  SampleTypeLabelVi,
  getRelationshipLabelViByKey,
  getSampleTypeLabelViByKey
} from '../../staff/types/sampleTest';

// Enums for dropdowns, matching backend enums exactly - imported from sampleTest.ts
// Local constants are no longer needed as we import from the centralized file

interface SampleFormData {
  donorName: string;
  relationshipToSubject: string;
  sampleType: string;
}

interface SampleInfoModalImprovedProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSubmitSuccess: () => void;
  mode?: 'create' | 'view';
}

export const SampleInfoModalImproved: React.FC<SampleInfoModalImprovedProps> = ({
  isOpen,
  onClose,
  bookingId,
  onSubmitSuccess,
  mode = 'create',
}) => {
  const [kitId, setKitId] = useState<string>("");
  const [sampleCount, setSampleCount] = useState<number>(1);
  const [isLoadingKit, setIsLoadingKit] = useState(false);
  const [clientName, setClientName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Multiple samples data
  const [samplesData, setSamplesData] = useState<SampleFormData[]>([]);
  const [existingSamples, setExistingSamples] = useState<TestSampleInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize samples data based on sampleCount
  useEffect(() => {
    if (sampleCount > 0) {
      const initialData = Array.from({ length: sampleCount }, (_, index) => ({
        donorName: index === 0 ? clientName : "",
        relationshipToSubject: "",
        sampleType: "",
      }));
      setSamplesData(initialData);
    }
  }, [sampleCount, clientName]);

  // Fetch TestKit information when modal opens
  useEffect(() => {
    const fetchTestKit = async () => {
      if (!isOpen || !bookingId) return;

      setIsLoadingKit(true);
      setApiError(null);

      try {
        const response = await getTestKitByBookingIdApi(bookingId);
        
        if (response.success && response.data) {
          setKitId(response.data.id);
          setSampleCount(response.data.sampleCount || 1);
          
          // Fetch existing samples
          const samples = await getTestSampleByKitIdApi(response.data.id);
          if (Array.isArray(samples)) {
            setExistingSamples(samples);
            
            // Update samples data with existing data if available, matching by donorName
            if (samples.length > 0) {
              const updatedSamplesData = Array.from({ length: response.data.sampleCount || 1 }, (_, index) => {
                // Try to find sample by position first, then by donorName similarity
                let existingSample = samples[index];
                
                // If not found by index, try to match by donorName with clientName for first sample
                if (!existingSample && index === 0 && clientName) {
                  const foundSample = samples.find(s => 
                    s.donorName && s.donorName.toLowerCase().includes(clientName.toLowerCase())
                  );
                  if (foundSample) {
                    existingSample = foundSample;
                  }
                }
                
                return existingSample ? {
                  donorName: existingSample.donorName,
                  relationshipToSubject: existingSample.relationshipToSubject.toString(),
                  sampleType: existingSample.sampleType.toString(),
                } : {
                  donorName: index === 0 ? clientName : "",
                  relationshipToSubject: "",
                  sampleType: "",
                };
              });
              setSamplesData(updatedSamplesData);
            }
          }
        } else {
          setApiError(response.message || "Không thể lấy thông tin TestKit.");
        }
      } catch (error) {
        console.error("Error fetching TestKit:", error);
        setApiError("Có lỗi xảy ra khi lấy thông tin TestKit.");
      } finally {
        setIsLoadingKit(false);
      }
    };

    fetchTestKit();
  }, [isOpen, bookingId, clientName]); // Add clientName dependency

  // Fetch booking information to get clientName
  useEffect(() => {
    const fetchBookingInfo = async () => {
      if (isOpen && bookingId) {
        try {
          const bookingData = await getBookingByIdApi(bookingId);
          if (bookingData && bookingData.clientName) {
            setClientName(bookingData.clientName || "");
          }
        } catch (error) {
          console.error('❌ Error fetching booking info:', error);
        }
      }
    };

    fetchBookingInfo();
  }, [isOpen, bookingId]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setKitId("");
      setSampleCount(1);
      setSamplesData([]);
      setExistingSamples([]);
      setActiveTab(0);
      setErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  const validateSample = (index: number): boolean => {
    const sample = samplesData[index];
    const newErrors: Record<string, string> = {};
    
    if (!sample.donorName.trim()) {
      newErrors[`donorName_${index}`] = "Vui lòng nhập tên người cho mẫu.";
    }
    if (!sample.relationshipToSubject) {
      newErrors[`relationshipToSubject_${index}`] = "Vui lòng chọn mối quan hệ.";
    }
    if (!sample.sampleType) {
      newErrors[`sampleType_${index}`] = "Vui lòng chọn loại mẫu.";
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSampleChange = (index: number, field: keyof SampleFormData, value: string) => {
    setSamplesData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });

    // Clear errors for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${field}_${index}`];
      return newErrors;
    });
  };

  const handleSubmitSample = async (index: number) => {
    if (!validateSample(index) || !kitId) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const sample = samplesData[index];
      const relationshipNumber = Number(sample.relationshipToSubject);
      const sampleTypeNumber = Number(sample.sampleType);

      if (isNaN(relationshipNumber) || isNaN(sampleTypeNumber)) {
        setApiError("Dữ liệu không hợp lệ. Vui lòng thử lại.");
        return;
      }

      const payload: SampleInfoPayload = {
        kitId: kitId,
        donorName: sample.donorName.trim(),
        relationshipToSubject: relationshipNumber,
        sampleType: sampleTypeNumber,
      };

      const response = await submitSampleInfoApi(payload);

      if (response.success) {
        // Refresh existing samples
        const updatedSamples = await getTestSampleByKitIdApi(kitId);
        setExistingSamples(updatedSamples);
        
        // If all samples are created, trigger success callback
        if (updatedSamples.length >= sampleCount) {
          onSubmitSuccess();
        }
      } else {
        setApiError(response.message || "Lưu thông tin mẫu thất bại.");
      }
    } catch (error) {
      console.error("Error submitting sample:", error);
      setApiError("Có lỗi xảy ra khi lưu thông tin mẫu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSampleExists = (index: number) => {
    return existingSamples[index] !== undefined;
  };

  const getSampleDisplayData = (index: number) => {
    const existingSample = existingSamples[index];
    if (existingSample) {
      console.log('🔍 Debug existingSample (Improved):', existingSample);
      console.log('🔍 relationshipToSubject (Improved):', existingSample.relationshipToSubject, typeof existingSample.relationshipToSubject);
      console.log('🔍 sampleType (Improved):', existingSample.sampleType, typeof existingSample.sampleType);
      
      // Convert to string for key mapping
      const relationshipKey = String(existingSample.relationshipToSubject);
      const sampleTypeKey = String(existingSample.sampleType);
      
      // Try both mapping approaches to see which one works
      console.log('🔍 Using getRelationshipLabelViByKey:', getRelationshipLabelViByKey(relationshipKey));
      console.log('🔍 Using getSampleTypeLabelViByKey:', getSampleTypeLabelViByKey(sampleTypeKey));
      console.log('🔍 Using RelationshipToSubjectLabelViByKey direct:', RelationshipToSubjectLabelViByKey[relationshipKey]);
      console.log('🔍 Using SampleTypeLabelViByKey direct:', SampleTypeLabelViByKey[sampleTypeKey]);
      
      // Also try number-based mapping
      const relationshipNum = Number(existingSample.relationshipToSubject);
      const sampleTypeNum = Number(existingSample.sampleType);
      console.log('🔍 Using RelationshipToSubjectLabelVi with number:', RelationshipToSubjectLabelVi[relationshipNum]);
      console.log('🔍 Using SampleTypeLabelVi with number:', SampleTypeLabelVi[sampleTypeNum]);
      
      // Use the helper functions for string mapping first, fallback to number mapping
      let relationshipLabel = getRelationshipLabelViByKey(relationshipKey);
      let sampleTypeLabel = getSampleTypeLabelViByKey(sampleTypeKey);
      
      // If string mapping didn't work, try number mapping
      if (relationshipLabel === "Không xác định" && RelationshipToSubjectLabelVi[relationshipNum]) {
        relationshipLabel = RelationshipToSubjectLabelVi[relationshipNum];
      }
      if (sampleTypeLabel === "Không xác định" && SampleTypeLabelVi[sampleTypeNum]) {
        sampleTypeLabel = SampleTypeLabelVi[sampleTypeNum];
      }
      
      console.log('🔍 Final mapped values (Improved):', { relationshipLabel, sampleTypeLabel });
      
      return {
        donorName: existingSample.donorName,
        relationshipLabel: relationshipLabel,
        sampleTypeLabel: sampleTypeLabel,
      };
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">
            {mode === 'view' ? 'Xem Thông Tin Mẫu Đã Nhập' : 'Điền Thông Tin Mẫu Xét Nghiệm'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-red-700 rounded-md bg-red-50">
              <AlertCircleIcon className="w-4 h-4" />
              <span className="text-sm">{apiError}</span>
            </div>
          )}

          {isLoadingKit && (
            <div className="flex items-center gap-2 p-3 text-blue-700 rounded-md bg-blue-50">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Đang tải thông tin TestKit...</span>
            </div>
          )}

          {/* {kitId && (
            <div className="flex items-center gap-2 p-3 text-green-700 rounded-md bg-green-50">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Đã tải thành công thông tin TestKit: {kitId}</span>
            </div>
          )} */}

          {/* Tab Navigation */}
          {samplesData.length > 1 && (
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {samplesData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === index
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Người thứ {index + 1}
                    {isSampleExists(index) && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đã hoàn thành
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Sample Form - Show only active tab */}
          {samplesData.length > 0 && samplesData[activeTab] && (
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Thông tin mẫu của người thứ {activeTab + 1}
                  {samplesData.length === 1 && ""}
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Display mode for existing samples */}
                {isSampleExists(activeTab) ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      {(() => {
                        const displayData = getSampleDisplayData(activeTab);
                        return displayData ? (
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-600">Tên người cho mẫu:</span>
                              <p className="text-gray-800">{displayData.donorName}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Mối quan hệ:</span>
                              <p className="text-gray-800">{displayData.relationshipLabel}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Loại mẫu:</span>
                              <p className="text-gray-800">{displayData.sampleTypeLabel}</p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                ) : mode === 'create' ? (
                  /* Create form - only show in create mode */
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tên người cho mẫu *</label>
                      <Input
                        value={samplesData[activeTab].donorName}
                        onChange={(e) => handleSampleChange(activeTab, 'donorName', e.target.value)}
                        placeholder={activeTab === 0 && clientName ? `${clientName} (từ thông tin đặt lịch)` : "Họ và tên người cung cấp mẫu"}
                        className="mt-1"
                      />
                      {errors[`donorName_${activeTab}`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`donorName_${activeTab}`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Mối quan hệ *</label>
                      <select
                        value={samplesData[activeTab].relationshipToSubject}
                        onChange={(e) => handleSampleChange(activeTab, 'relationshipToSubject', e.target.value)}
                        className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn mối quan hệ</option>
                        {Object.entries(RelationshipToSubjectLabelVi).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {errors[`relationshipToSubject_${activeTab}`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`relationshipToSubject_${activeTab}`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Loại mẫu *</label>
                      <select
                        value={samplesData[activeTab].sampleType}
                        onChange={(e) => handleSampleChange(activeTab, 'sampleType', e.target.value)}
                        className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn loại mẫu</option>
                        {Object.entries(SampleTypeLabelVi).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {errors[`sampleType_${activeTab}`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`sampleType_${activeTab}`]}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSubmitSample(activeTab)}
                        disabled={isSubmitting || !kitId}
                        className="!text-white !bg-blue-900 hover:!bg-blue-800"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Lưu thông tin
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View mode - no form shown */
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-600">Không có thông tin mẫu để hiển thị.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
