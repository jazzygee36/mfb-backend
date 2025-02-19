// dto/verify-email.dto.ts
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6, {
    message: 'Verification code must be exactly 6 characters long',
  })
  verificationCode: string;
}
