import React from 'react';
import { AlertCircleIcon, XIcon } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  title?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  title = "Lỗi"
}) => {
  console.log('🔄 ErrorModal render:', { isOpen, errorMessage, title });
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mr-3">
            <AlertCircleIcon className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-700">{title}</h2>
        </div>

        {/* Error message */}
        <div className="mb-6">
          <p className="text-red-600 leading-relaxed">{errorMessage}</p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
