# NestJS DDD Blog Service

NestJS와 Effect.ts를 활용하여 Domain-Driven Design(DDD) 원칙을 적용한 현대적인 API 서비스입니다.
DDD와 Effect.ts를 학습하기 위한 프로젝트입니다.

## 🏗️ 아키텍처

이 프로젝트는 **DDD** 를 학습하기 위한 프로젝트입니다.
Repository/DAO 분리 패턴을 통해 관심사를 명확히 분리했습니다.

### 📁 프로젝트 구조

```
src/
├── auth/                   # 인증 도메인
│   ├── domain/             # 엔티티, 값 객체, 리포지토리 인터페이스
│   ├── application/        # 유스케이스, DTO
│   ├── infrastructure/     # 리포지토리 구현체
│   └── presentation/       # 컨트롤러, 가드
├── post/                   # 포스트 도메인
│   ├── domain/             # Post 엔티티, Title/PostContent VO
│   ├── application/        # 유스케이스, DAO 인터페이스
│   ├── infrastructure/     # 리포지토리/DAO 구현체
│   └── presentation/       # 포스트 컨트롤러
├── comment/                # 댓글 도메인
│   ├── domain/             # Comment 엔티티, CommentContent VO
│   ├── application/        # 유스케이스, DAO 인터페이스
│   ├── infrastructure/     # 리포지토리/DAO 구현체
│   └── presentation/       # 댓글 컨트롤러
├── member/                 # 회원 도메인
│   ├── domain/             # Member 엔티티, Email/Password VO
│   ├── application/        # 유스케이스, DAO 인터페이스
│   ├── infrastructure/     # 리포지토리/DAO 구현체
│   └── presentation/       # 회원 컨트롤러
├── shared/                 # 공유 모듈
│   ├── types/              # AggregateRoot, ValueObject, Branded Types
│   ├── errors/             # 도메인별 에러 클래스
│   ├── decorators/         # 커스텀 데코레이터
│   ├── guards/             # JWT 인증 가드
│   └── response/           # API 응답 래퍼
└── repository/             # DI 설정 모듈
```

## 🚀 핵심 특징

### 🎯 DDD

- **도메인 중심 설계**: 비즈니스 로직을 도메인 레이어에 집중
- **관심사 분리**: Repository(CRUD) vs DAO(쿼리) 명확한 역할 분담
- **의존성 역전**: 도메인이 인프라에 의존하지 않는 구조

### 🔧 타입 안전성

- **Branded Types**: `AggregateRootId<T>`를 통한 ID 타입 안전성
- **JavaScript Private Fields**: `#field` 문법으로 진정한 캡슐화
- **Value Objects**: 도메인 개념을 타입으로 표현

### ⚡ Effect.ts 에러 핸들링

- **Effect.ts**: 함수형 프로그래밍으로 안전한 에러 처리
- **Railway-oriented Programming**: 성공/실패 경로를 명확히 분리
- **타입 안전한 에러**: 컴파일 타임에 모든 에러 케이스 검증

## 🔧 기술 스택

### Core

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Functional Programming**: Effect.ts
- **Package Manager**: pnpm

### Architecture

- **Design Pattern**: Domain-Driven Design (DDD)
- **Error Handling**: Effect.ts Railway Pattern

### Authentication & Security

- **Authentication**: JWT
- **Authorization**: Role-based Access Control

## 🏛️ 아키텍처 세부사항

### 🎯 Repository vs DAO 패턴

```typescript
// Repository: Aggregate Root의 영속성만 담당
abstract class PostRepository {
  abstract save(post: Post): Effect.Effect<Post>;
  abstract findById(id: string): Effect.Effect<Post | null>;
  abstract delete(id: string): Effect.Effect<void>;
}

// DAO: 쿼리와 데이터 변환 전담
abstract class PostDao {
  abstract findByStatus(status: PostStatus, options: PaginationOptions);
  abstract searchByTitle(keyword: string, options: PaginationOptions);
}
```

### 🔐 타입 안전성 강화

```typescript
// Branded Types로 ID 타입 안전성
type AggregateRootId<T extends string> = string & { readonly __brand: T };

class Post extends AggregateRoot<'Post'> {
  constructor(id: AggregateRootId<'Post'>) { ... }
}

// JavaScript Private Fields로 캡슐화
class Post {
  #title: Title;        // 진정한 private
  #content: PostContent;

  get title(): Title { return this.#title; }
}
```

### ⚡ Effect.ts 에러 핸들링

```typescript
// 함수형 에러 처리
updatePost(command: UpdatePostCommand) {
  return Effect.gen(function* () {
    const post = yield* postRepository.findById(command.id);
    if (!post) {
      yield* Effect.fail(new PostNotFoundError({ id: command.id }));
    }

    yield* post.updateTitle(command.title, command.authorId);
    yield* postRepository.save(post);

    return post.toPlain();
  });
}
```

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js 18+
- pnpm 8+

### 설치 및 실행

```bash
# 의존성 설치
$ pnpm install

# 개발 서버 실행
$ pnpm run start:dev

# 프로덕션 빌드
$ pnpm run build
$ pnpm run start:prod
```

### 테스트

```bash
# 단위 테스트
$ pnpm run test

# E2E 테스트
$ pnpm run test:e2e

# 테스트 커버리지
$ pnpm run test:cov
```

## 📊 코드 품질

### 린팅 및 포맷팅

```bash
# ESLint 실행
$ pnpm run lint

# 코드 포맷팅
$ pnpm run format
```

### 타입 검사

```bash
# TypeScript 컴파일 검사
$ pnpm run build
```
