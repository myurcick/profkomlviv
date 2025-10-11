export interface NewsFormData {
  title: string;
  content: string;
  imageUrl: string;
  isImportant: boolean;
}

export interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  isImportant: boolean;
  publishedAt: string;
}