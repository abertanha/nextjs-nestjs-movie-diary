import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendConfirmationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
