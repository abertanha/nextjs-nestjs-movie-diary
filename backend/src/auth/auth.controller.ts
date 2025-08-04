import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
