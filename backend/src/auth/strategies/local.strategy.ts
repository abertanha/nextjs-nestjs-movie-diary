import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<any> {
    const loginDto: LoginDto = { email: email, password: password };

    const user = await this.authService.validateUser(loginDto);

    if (!user) {
      throw new HttpException(`Invalid credentials!`, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
