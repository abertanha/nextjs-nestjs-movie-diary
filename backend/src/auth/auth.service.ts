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
  async login(user: User): Promise<LoginResponse> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
