import { Controller, Post, Body, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { usuario } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(usuario)
    private diagramaRepository: Repository<usuario>,
  ) { }

  @Post('register')
  async register(@Body() body: { ci: number, nombre: string, apellido: string, direccion: string, telefono: number, contrasena: string }) {
    const { ci, nombre, apellido, direccion, telefono, contrasena } = body;

    try {
      const user = await this.userService.register(ci, nombre, apellido, direccion, telefono, contrasena);
      return { message: 'Registro exitoso', user };
    } catch (error) {
      throw new HttpException('Error al registrar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() body: { ci: number; contrasena: string }) {
    try {
      const user = await this.userService.login(body.ci, body.contrasena);
      if (!user) {
        throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED);
      }
      return { message: 'Inicio de sesión exitoso', user };
    } catch (error) {
      throw new HttpException('Error al iniciar sesión: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  
}