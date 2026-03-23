export interface TestKitResponse {
  id: string;
  bookingId: string;
  shippedAt: Date;
  receivedAt: Date;
  sentToLabAt: Date;
  labReceivedAt: Date;
  note: string;
  samples: string[];
  sampleCount: number;
  createdAt: Date;
  updatedAt: Date;
  pickupInfoId: string;
  deliveryInfoId: string;
}
