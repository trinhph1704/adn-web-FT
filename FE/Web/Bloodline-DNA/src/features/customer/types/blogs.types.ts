export interface BlogPost {
  id: string;
  title: string;
  content: string;
  thumbnailURL: string;
  status: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}