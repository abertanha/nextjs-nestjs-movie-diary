import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Username is required ' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required ' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
