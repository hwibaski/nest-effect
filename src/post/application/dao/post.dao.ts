import { PostStatus } from '../../../shared/types';

// DAO에서 반환할 단순한 데이터 타입 (Plain Object)
export interface PostData {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  authorId: string;
  publishedAt?: Date;
  tags: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface PostListData {
  id: string;
  title: string;
  contentPreview: string;
  status: PostStatus;
  authorId: string;
  publishedAt?: Date;
  tags: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
