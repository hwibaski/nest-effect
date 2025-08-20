import { AuthUserRole } from '../../../shared/types';

// DAO에서 반환할 단순한 데이터 타입 (Plain Object)
export interface MemberData {
  id: string;
  email: string;
  name: string;
  role: AuthUserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface MemberListData {
  id: string;
  email: string;
  name: string;
  role: AuthUserRole;
  isActive: boolean;
  createdAt: Date;
}
