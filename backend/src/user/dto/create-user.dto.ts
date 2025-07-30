import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'This email must be valid!' })
  @IsNotEmpty({ message: 'The email field cannot be empty!' })
  email: string;

  @IsNotEmpty({ message: 'The password field cannot be empty!' })
  @MinLength(8, { message: 'Your password must has at least 8 characters!' })
  password: string;
}
