import type { LucideIcon } from "lucide-react";

interface DnaIllustrationProps {
  badgeIcon?: LucideIcon;
  badgeColor?: string;
}

export function DnaIllustration({
  badgeIcon: BadgeIcon,
  badgeColor = "bg-green-400",
}: DnaIllustrationProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
        <svg
          className="w-12 h-12 text-white animate-pulse"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <defs>
            <style>
              {`
                .dna-strand1 { animation: dna-rotate 4s linear infinite; }
                .dna-strand2 { animation: dna-rotate 4s linear infinite reverse; }
                @keyframes dna-rotate {
                  0% { transform: rotateY(0deg); }
                  100% { transform: rotateY(360deg); }
                }
              `}
            </style>
          </defs>
          <g className="dna-strand1">
            <path
              d="M8 2c0 4-2 6-2 10s2 6 2 10"
              strokeLinecap="round"
            />
            <circle cx="8" cy="4" r="1.5" fill="currentColor" />
            <circle cx="6" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" />
            <circle cx="6" cy="16" r="1.5" fill="currentColor" />
            <circle cx="8" cy="20" r="1.5" fill="currentColor" />
          </g>
          <g className="dna-strand2">
            <path
              d="M16 2c0 4 2 6 2 10s-2 6-2 10"
              strokeLinecap="round"
            />
            <circle cx="16" cy="4" r="1.5" fill="currentColor" />
            <circle cx="18" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="12" r="1.5" fill="currentColor" />
            <circle cx="18" cy="16" r="1.5" fill="currentColor" />
            <circle cx="16" cy="20" r="1.5" fill="currentColor" />
          </g>
          <line
            x1="8"
            y1="4"
            x2="16"
            y2="4"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.7"
          />
          <line
            x1="6"
            y1="8"
            x2="18"
            y2="8"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.7"
          />
          <line
            x1="8"
            y1="12"
            x2="16"
            y2="12"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.7"
          />
          <line
            x1="6"
            y1="16"
            x2="18"
            y2="16"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.7"
          />
          <line
            x1="8"
            y1="20"
            x2="16"
            y2="20"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.7"
          />
        </svg>
      </div>
      {BadgeIcon && (
        <div
          className={`absolute flex items-center justify-center w-8 h-8 rounded-full -top-2 -right-2 ${badgeColor}`}
        >
          <BadgeIcon size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}
