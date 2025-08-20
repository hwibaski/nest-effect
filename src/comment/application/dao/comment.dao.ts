// DAO에서 반환할 단순한 데이터 타입 (Plain Object)
export interface CommentData {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CommentListData {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}
