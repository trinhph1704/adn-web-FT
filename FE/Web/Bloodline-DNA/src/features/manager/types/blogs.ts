export interface BlogResponse {
  id: string;
  title: string;
  content: string;
  thumbnailURL: string;
  status: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  tagIds?: string; 
  tagName?: string; // Optional for GET
  tagNames?: string[]; // Optional for GET
}

export interface BlogCreateRequest {
  title: string;
  content: string;
  thumbnailURL: File; // File for POST
  status: number;
  authorId: string;
  tagIds: string;
}

export interface BlogUpdateRequest {
  id: string;
  title: string;
  content: string;
  thumbnailURL?: string; // Optional string for PUT
  status: number;
  authorId: string;
  tagIds?: string; // Optional for PUT
}