import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    // Aquí deberías validar usuario y contraseña en la base de datos
    const user = { id: 1, username: 'user1', password: 'hashedPassword' }; // Simulación
    const isValid = await this.authService.validateUser(
      loginDto.password,
      user.password,
    );

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return this.authService.login(user);
  }
}
