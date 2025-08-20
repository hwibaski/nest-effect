import {
  IsEmail,
  IsString,
} from 'class-validator';

export class LoginMemberDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class MemberResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthResponseDto {
  member: MemberResponseDto;
  accessToken: string;
}