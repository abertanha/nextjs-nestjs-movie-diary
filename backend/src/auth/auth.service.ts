import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/user/entities/user.entity';
import { LoginResponse } from './interfaces/auth.types';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  /**
   * Validates user credentials against the stored hash in the database.
   * This method is called by the LocalStrategy during the login process.
   * @param loginDto An object containing the user's email and password.
   * @returns A promise that resolves to the user object without the password if credentials are valid.
   * @throws HttpException (NOT_FOUND) if the user does not exist.
   * @throws HttpException (UNAUTHORIZED) if the password is incorrect.
   */
  async validateUser(loginDto: LoginDto): Promise<any> {
    const foundUser = await this.userService.findOneByEmail(loginDto.email);

    if (!foundUser) {
      throw new HttpException(
        `The user with ${loginDto.email} does not exist!`,
        HttpStatus.NOT_FOUND,
      );
    }

    const [salt, storedHash] = foundUser.password.split('.');
    const hash = (await scrypt(loginDto.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new HttpException(`Invalid credentials`, HttpStatus.UNAUTHORIZED);
    }

    const { password: _, ...result } = foundUser;

    return result;
  }

  /**
   * Generates a JWT access token for a successfully validated user.
   * @param user The user object that has been validated by the LocalStrategy.
   * @returns A promise that resolves to an object containing the access token.
   */
  async login(user: User): Promise<LoginResponse> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  /**
   * Verifies a user's email address using the provided token.
   * It calls the UserService to handle the activation logic and then
   * strips the password from the returned user object for a safe response.
   * @param token The verification token from the email link.
   * @returns A promise that resolves to the user data without the password.
   * @throws NotFoundException if the token is invalid or expired.
   */
  async verifyEmail(token: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.activateUserAccount(token);

    const { password, ...result } = user;

    return result;
  }
}
