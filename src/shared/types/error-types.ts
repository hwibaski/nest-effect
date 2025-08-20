// 에러 시스템에서 사용할 공통 타입 정의

// 리소스 타입 열거형
export const ResourceType = {
  MEMBER: 'MEMBER',
  POST: 'POST',
  COMMENT: 'COMMENT',
  AUTH: 'AUTH',
} as const;

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

// 액션 타입 열거형
export const Action = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  PUBLISH: 'PUBLISH',
  UNPUBLISH: 'UNPUBLISH',
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  COMMENT: 'COMMENT',
} as const;

export type Action = (typeof Action)[keyof typeof Action];

// 도메인별 필드 타입
export const ValidationField = {
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  TITLE: 'TITLE',
  CONTENT: 'CONTENT',
  NAME: 'NAME',
} as const;

export type ValidationField =
  (typeof ValidationField)[keyof typeof ValidationField];
