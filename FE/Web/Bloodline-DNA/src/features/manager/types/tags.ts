export interface TagRequest {
  name: string;
}

export interface TagResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagUpdateRequest {
  id: string;
  name: string;
}

