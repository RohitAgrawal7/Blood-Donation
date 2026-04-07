import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username?: string; password?: string }) {
    const { username, password } = body || {};
    if (!username || !password) throw new HttpException('username and password required', HttpStatus.BAD_REQUEST);
    const token = await this.authService.login(username, password);
    if (!token) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return { accessToken: token };
  }
}
