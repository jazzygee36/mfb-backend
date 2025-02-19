import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
export class CreateCorporateDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  businessType: string;

  @IsNotEmpty()
  @IsEmail()
  companyEmail: string;

  @IsNotEmpty()
  @IsString()
  incorporationDate: string;

  @IsNotEmpty()
  password: string;
}
