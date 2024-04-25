import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { usuario } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(usuario)
    private userRepository: Repository<usuario>,
  ) { }

  async register(ci: number, nombre: string, apellido: string, direccion: string, telefono: number, contrasena: string): Promise<{ usuario: usuario; token: string }> {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const usuario = this.userRepository.create({ ci, nombre, apellido, direccion, telefono, contrasena: hashedPassword });
    const savedUser = await this.userRepository.save(usuario);

    const token = jwt.sign(
      { userCi: savedUser.ci, username: savedUser.nombre },
      'my_token_unique_meetflow',
      { expiresIn: "1h" }
    );

    return { usuario: savedUser, token };
  }

  async login(ci: number, contrasena: string): Promise<{ usuario: usuario; token: string } | null> {
    console.log('Datos recibidos en el backend:', { ci, contrasena });

    const usuario = await this.userRepository.findOne({ where: { ci } });
    if (usuario && (await bcrypt.compare(contrasena, usuario.contrasena))) {
      const token = jwt.sign(
        { userCi: usuario.ci, username: usuario.nombre }, 
        'my_token_unique_meetflow',
        { expiresIn: "1h" } 
      );
      console.log('devolviendo correctamente desde el backend',usuario, token);
      return { usuario, token };
    }
    return null;
  }


}
