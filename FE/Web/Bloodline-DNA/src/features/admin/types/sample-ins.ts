export interface SampleInsRequest {
  sampleType: number;
  instructionText: string;
  mediaUrl: string;
}

export interface SampleInsResponse {
  id: number;
  sampleType: number;
  instructionText: string;
  mediaUrl: string;
}

export interface SampleInsUpdateRequest extends SampleInsRequest {
  id: number;
}
