// 성공 응답 클래스
export class SuccessResponse<T = any> {
  readonly success: true = true as const;
  readonly statusCode: number;
  readonly message: string;
  readonly data: T;
  readonly timestamp: string;

  constructor(data: T, message: string, statusCode: number = 200) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static of<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
  ): SuccessResponse<T> {
    return new SuccessResponse(data, message, statusCode);
  }

  static created<T>(
    data: T,
    message: string = 'Created successfully',
  ): SuccessResponse<T> {
    return new SuccessResponse(data, message, 201);
  }

  static empty(
    message: string = 'Success',
    statusCode: number = 200,
  ): SuccessResponse<null> {
    return new SuccessResponse(null, message, statusCode);
  }
}

// 에러 응답 클래스
export class ErrorResponse {
  readonly success: false = false as const;
  readonly statusCode: number;
  readonly message: string;
  readonly code: string;
  readonly details: Record<string, any>;
  readonly timestamp: string;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: Record<string, any>,
  ) {
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
    this.details = details || {};
    this.timestamp = new Date().toISOString();
  }

  static of(
    message: string,
    code: string,
    statusCode: number,
    details?: Record<string, any>,
  ): ErrorResponse {
    return new ErrorResponse(message, code, statusCode, details);
  }

  static badRequest(
    message: string,
    details?: Record<string, any>,
    code: string = 'BAD_REQUEST',
  ): ErrorResponse {
    return new ErrorResponse(message, code, 400, details);
  }

  static unauthorized(
    message: string = 'Unauthorized',
    code: string = 'UNAUTHORIZED',
    details?: Record<string, any>,
  ): ErrorResponse {
    return new ErrorResponse(message, code, 401, details);
  }

  static forbidden(
    message: string = 'Forbidden',
    details?: Record<string, any>,
    code: string = 'FORBIDDEN',
  ): ErrorResponse {
    return new ErrorResponse(message, code, 403, details);
  }

  static notFound(
    message: string = 'Resource not found',
    details?: Record<string, any>,
    code: string = 'NOT_FOUND',
  ): ErrorResponse {
    return new ErrorResponse(message, code, 404, details);
  }

  static conflict(
    message: string = 'Resource already exists',
    details?: Record<string, any>,
    code: string = 'CONFLICT',
  ): ErrorResponse {
    return new ErrorResponse(message, code, 409, details);
  }

  static unprocessableEntity(
    message: string = 'Unprocessable entity',
    details?: Record<string, any>,
    code: string = 'UNPROCESSABLE_ENTITY',
  ): ErrorResponse {
    return new ErrorResponse(message, code, 422, details);
  }

  static internalError(
    message: string = 'Internal server error',
    details?: Record<string, any>,
    code: string = 'INTERNAL_ERROR',
  ): ErrorResponse {
    return new ErrorResponse(message, code, 500, details);
  }

  static validation(
    message: string = 'Validation failed',
    validationErrors: ValidationError[],
    code: string = 'VALIDATION_ERROR',
  ): ErrorResponse {
    return new ErrorResponse(message, code, 400, {
      validationErrors,
    });
  }
}

// 페이지네이션 성공 응답 클래스
export class PaginatedResponse<T> {
  readonly success: true = true as const;
  readonly statusCode: number;
  readonly message: string;
  readonly data: {
    items: T[];
    pagination: PaginationMeta;
  };
  readonly timestamp: string;

  constructor(
    items: T[],
    pagination: PaginationMeta,
    message: string = 'Success',
    statusCode: number = 200,
  ) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = { items, pagination };
    this.timestamp = new Date().toISOString();
  }

  static of<T>(
    items: T[],
    pagination: PaginationMeta,
    message: string = 'Success',
    statusCode: number = 200,
  ): PaginatedResponse<T> {
    return new PaginatedResponse(items, pagination, message, statusCode);
  }
}

// 인터페이스들
export interface ValidationError {
  field: string;
  receivedValue: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Union 타입으로 API 응답 정의
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;
export type PaginatedApiResponse<T> = PaginatedResponse<T> | ErrorResponse;

// 응답 타입 가드
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> {
  return response.success === true;
}

export function isErrorResponse(
  response: ApiResponse,
): response is ErrorResponse {
  return response.success === false;
}

export function isPaginatedResponse<T>(
  response: PaginatedApiResponse<T>,
): response is PaginatedResponse<T> {
  return response.success === true;
}
