import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { usuario } from '../entity/user.entity';
import { reunion } from '../entity/reunion.entity';
import { diagrama } from '../entity/diagrama.entity';
import * as crypto from 'crypto'; // Biblioteca para generar contrasenas aleatorias
import { DiagramaService } from 'src/diagrama/diagrama.service';
import { colaborador } from 'src/entity/colaborado.entity';

@Injectable()
export class ReunionService {
    constructor(
        @InjectRepository(reunion)
        private reunionRepository: Repository<reunion>,
        @InjectRepository(usuario)
        private usuarioRepository: Repository<usuario>,
        @InjectRepository(diagrama)
        private diagramaRepository: Repository<diagrama>,
        @InjectRepository(colaborador)
        private colaboradorRepository: Repository<colaborador>,
        private readonly diagramaService: DiagramaService

    ) { }

    async crearReunion(usuarioId: number, data: any): Promise<reunion> {
        
        const codigo = await this.generarCodigoUnico();

        
        const contrasena = this.generarcontrasenaAleatoria();

        
        try {
            const usuarioc = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
            // Crear una nueva instancia de Reunion
            const reunionc = new reunion();
            const diagramas = new diagrama();
            // console.log('usuarioc: ',usuarioc)
            reunionc.codigo = codigo;
            reunionc.password = contrasena;
            reunionc.usuario = usuarioc;
            reunionc.usuarioid = usuarioId;

            diagramas.titulo = data.titulo;
            diagramas.descripcion = data.descripcion;
            diagramas.contenido = null;
            diagramas.idusuario = usuarioId;
            await this.reunionRepository.save(reunionc);
            await this.diagramaRepository.save(diagramas);
            console.log('diagramas.id ', diagramas.id)
            
            reunionc.diagramaid = diagramas.id;
            diagramas.idreunion = reunionc.id;

            
            await this.reunionRepository.save(reunionc);
            await this.diagramaRepository.save(diagramas);
            return reunionc;
        } catch (error) {
            throw new Error(`Error al CrearReunion Backend: ${error}`);
        }
    }

    private async generarCodigoUnico(): Promise<string> {
        let codigo: string;
        let exists: boolean;

        do {
            codigo = this.generarCodigo(); // Generar un código
            exists = await this.codigoExists(codigo); // Verificar si existe en la base de datos
        } while (exists);

        return codigo;
    }
    private generarCodigo(): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const longitudCodigo = 8; // Puedes ajustar la longitud del código según tus necesidades
        let codigo = '';

        for (let i = 0; i < longitudCodigo; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres.charAt(indice);
        }

        return codigo;
    }

    private async codigoExists(codigo: string): Promise<boolean> {
        const count = await this.reunionRepository.count({ where: { codigo } });
        return count > 0;
    }

    private generarcontrasenaAleatoria(): string {
        
        return crypto.randomBytes(5).toString('hex');
    }

    async entrarReunion(codigo: string, contrasena: string): Promise<reunion | null> {
        
        const reunionb = await this.reunionRepository.findOne({
            where: { codigo, password: contrasena },
        });

        
        return reunionb || null;
    }

    async obtenerReunionPorCodigo(codigo: string): Promise<reunion | null> {
        try {
            const reunion = await this.reunionRepository.findOne({ where: { codigo } });
            return reunion || null;
        } catch (error) {
            throw new NotFoundException('No se pudo obtener la reunión');
        }
    }

    async obtenerReunionesDeUsuario(idUsuario: number): Promise<any> {
        
        const reunionesConDiagrama = await this.reunionRepository.query( `
        SELECT DISTINCT ON (reunion.id) reunion.*, diagrama.titulo AS diagrama_titulo, diagrama.descripcion AS diagrama_descripcion
        FROM reunion, diagrama
        WHERE reunion.usuarioid =$1 AND reunion.usuarioid = $1;
      `, [idUsuario]);
      return reunionesConDiagrama;
    }

    async validarCodigoYContraseña(codigo: string, contrasena: string): Promise<reunion | null> {
        const reunion = await this.entrarReunion(codigo, contrasena);
        if (!reunion) {
            throw new NotFoundException('Código o contraseña incorrectos');
        }
        return reunion;
    }
    async guardarSvgEnBaseDeDatos(svgString: string, idReunion: number): Promise<string> {
        try {
            const reunion = await this.reunionRepository.findOne({ where: { id: idReunion } });
            if (reunion) {
                reunion.svg = svgString;
                await this.reunionRepository.save(reunion);
                return `http://localhost:3001/${idReunion}/${svgString}`;
            } else {
                throw new Error('Reunión no encontrada serv');
            }
        } catch (error) {
            throw new Error(`Error al guardar el SVG en la reunión: ${error.message}`);
        }
    }
}