export interface TestResultRequest {
  TestBookingId: string;
  ResultSummary: string;
  ResultDate: Date;
  ResultFile: File;
}

export interface TestResultResponse {
  id: string;
  testBookingId: string;
  resultSummary: string;
  resultDate: string;
  resultFileUrl: string;
  client: {
    id: string;
    fullName: string;
    address: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}
