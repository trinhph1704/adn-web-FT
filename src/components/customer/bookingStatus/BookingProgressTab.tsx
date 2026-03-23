"use client";

import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getStatusConfig } from "./StatusConfig";
import { BookingStatus, BookingStatusLabels } from "@/types";

interface ProgressStep {
  status: BookingStatus;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

const STATUS_ORDER: BookingStatus[] = [
  BookingStatus.Pending,
  BookingStatus.DepositPaid,
  BookingStatus.KitDelivering,
  BookingStatus.KitDelivered,
  BookingStatus.SampleCollected,
  BookingStatus.SampleDelivering,
  BookingStatus.SampleReceived,
  BookingStatus.Testing,
  BookingStatus.ResultReady,
  BookingStatus.FullyPaid,
  BookingStatus.Completed,
];

function buildProgressSteps(currentStatus: BookingStatus): ProgressStep[] {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentStatus === BookingStatus.Cancelled) {
    return [
      { status: BookingStatus.Pending, label: BookingStatusLabels[BookingStatus.Pending], isCompleted: true, isCurrent: false },
      { status: BookingStatus.Cancelled, label: BookingStatusLabels[BookingStatus.Cancelled], isCompleted: true, isCurrent: true },
    ];
  }
  return STATUS_ORDER.slice(0, currentIndex + 1).map((s, i) => ({
    status: s,
    label: BookingStatusLabels[s],
    isCompleted: i < currentIndex,
    isCurrent: i === currentIndex,
  }));
}

interface BookingProgressTabProps {
  booking: { status?: number };
}

export function BookingProgressTab({ booking }: BookingProgressTabProps) {
  const status = (booking.status ?? BookingStatus.Pending) as BookingStatus;
  const steps = buildProgressSteps(status);
  const statusInfo = getStatusConfig(status);
  const StatusIcon = statusInfo.icon;

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-blue-50/50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-blue-900">Tiến Trình Xét Nghiệm</h3>
            <span className="text-sm font-medium text-blue-700">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative space-y-0">
            {steps.map((step, idx) => {
              const stepConfig = getStatusConfig(step.status);
              const Icon = stepConfig.icon;
              return (
                <div key={step.status} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  {idx < steps.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      step.isCompleted
                        ? "bg-green-100 text-green-600"
                        : step.isCurrent
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        step.isCurrent ? "text-blue-900" : step.isCompleted ? "text-slate-700" : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.isCurrent && (
                      <p className="mt-1 text-sm text-slate-600">{stepConfig.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
