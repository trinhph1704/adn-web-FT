import { STATUS_MAPPING } from "../constants/statusMapping";

export const statusToNumber = (status: string | number | null | undefined): number => {
  if (typeof status === 'number') {
    return status;
  }

  if (!status) {
    console.warn(`Invalid status received: ${status}`);
    return -1;
  }

  const statusMap: Record<string, number> = {
    Pending: 0,
    PreparingKit: 1,
    DeliveringKit: 2,
    KitDelivered: 3,
    WaitingForSample: 4,
    ReturningSample: 5,
    SampleReceived: 6,
    Testing: 7,
    Completed: 8,
    Cancelled: 9,
    StaffGettingSample: 10,
    CheckIn: 11,
  };

  const normalizedStatus = status.trim();
  const numericStatus = statusMap[normalizedStatus] ?? -1;

  if (numericStatus === -1) {
    console.warn(`Unknown status received: "${status}"`);
  }

  return numericStatus;
};

export const getStatusLabel = (statusValue: string | number | null | undefined): string => {
  const numericValue = statusToNumber(statusValue);
  const status = STATUS_MAPPING.find((item) => item.value === numericValue);
  return status ? status.label : 'Không xác định';
};

export const getValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getFullYear() <= 1 ? new Date() : date;
};

export const renderCollectionMethod = (method: string) => {
  if (!method) return 'Chưa xác định';
  if (['Tự lấy mẫu', 'Tại Cơ sở'].includes(method)) {
    return method;
  }
  switch (method) {
    case 'SelfSample':
      return 'Tự lấy mẫu';
    case 'AtFacility':
      return 'Tại Cơ sở';
    default:
      return method;
  }
};