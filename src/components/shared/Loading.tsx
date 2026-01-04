import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
  color?: 'blue' | 'green' | 'white';
}

export default function Loading({
  size = 'medium',
  message = 'Đang tải...',
  fullScreen = false,
  color = 'blue',
}: LoadingProps) {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    white: 'text-white',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
      />
      {message && (
        <p className={`text-sm ${color === 'white' ? 'text-white' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
