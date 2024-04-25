import { Controller, Get, Post, Body, Param, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ReunionService } from './reunion.service';
import { reunion } from '../entity/reunion.entity';
import { DiagramaService } from 'src/diagrama/diagrama.service';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from 'src/user/user.service';
import { JavaConverter } from './convertJava';
import { PythonConverter } from './convertPython';
import { JavaScriptConverter } from './convertJavaScript';
@Controller('reuniones')
export class ReunionController {
    constructor(
        private reunionService: ReunionService,
        private diagramaService: DiagramaService,
        private userService: UserService,
    ) { }

    @Post()
    async crearReunion(@Body() body: { usuarioId: number, data: any }): Promise<{ reunion: reunion }> {
        console.log('create reunion')
        try {
            const reunion = await this.reunionService.crearReunion(body.usuarioId, body.data);
            // const diagrama = this.diagramaService.obtenerDiagramaPorReunion(reunion.id);
            // console.log('create reunion2', reunion )

            return { reunion };
        } catch (error) {
            throw new NotFoundException('No se pudo crear la reunión');
        }
    }
    // En el controlador de usuario
    @Get(':idUsuario/reuniones')
    async obtenerReunionesDeUsuario(@Param('idUsuario') idUsuario: number): Promise<reunion[]> {
        console.log(idUsuario);
        const reunion = await this.reunionService.obtenerReunionesDeUsuario(idUsuario);
        return reunion;
    }
    @Post('validar')
    async validarCodigoYContraseña(@Body() body: { codigo: string, contrasena: string }): Promise<reunion | null> {
        const { codigo, contrasena } = body;
        const reunion = await this.reunionService.entrarReunion(codigo, contrasena);
        if (!reunion) {
            throw new UnauthorizedException('Código o contraseña incorrectos');
        }
        return reunion;
    }
    @Post('savesvg')
    async guardarSvg(@Body() body: { svgString: string, id: number }): Promise<string> {
        try {
            // Guarda el contenido SVG en tu base de datos utilizando el servicio de base de datos
            const svgUrl = await this.reunionService.guardarSvgEnBaseDeDatos(body.svgString, body.id);
            // Guarda el SVG como un archivo en la carpeta 'public'
            const publicFolder = path.join(__dirname, '..', '..', 'src', 'public');
            const filePath = path.join(publicFolder, `${body.id}.svg`);

            fs.writeFileSync(filePath, body.svgString, { encoding: 'utf8' });

            return svgUrl;
        } catch (error) {
            throw new Error(`Error al guardar el SVG en la reunión controller: ${error.message}`);
        }
    }

    @Post('java')
    async convertToJava(@Body() body: { nodeDataArray: any[], linkDataArray: any[] }): Promise<string> {
        console.log('Datos recibidos:', body);

        try {
            const javaCode = JavaConverter.convertToJava(body.nodeDataArray, body.linkDataArray);
            // 'YourJavaConverter' es la clase o función que convierte los datos de GoJS a código Java.
            // Debes implementarla o importarla adecuadamente según tu estructura de proyecto.

            // Guarda el código Java en tu base de datos o donde lo necesites
            // ...

            return javaCode;
        } catch (error) {
            // Maneja errores de conversión aquí
            throw new Error(`Error al convertir a código Java: ${error.message}`);
        }
    }
    @Post('python')
    async convertToPython(@Body() body: { nodeDataArray: any[], linkDataArray: any[] }): Promise<string> {
        console.log('Datos recibidos:', body);

        try {
            const pythonCode = PythonConverter.convertToPython(body.nodeDataArray, body.linkDataArray);
            // 'YourJavaConverter' es la clase o función que convierte los datos de GoJS a código Java.
            // Debes implementarla o importarla adecuadamente según tu estructura de proyecto.

            // Guarda el código Java en tu base de datos o donde lo necesites
            // ...

            return pythonCode;
        } catch (error) {
            // Maneja errores de conversión aquí
            throw new Error(`Error al convertir a código Python: ${error.message}`);
        }
    }
    @Post('javascript')
    async convertToJavascript(@Body() body: { nodeDataArray: any[], linkDataArray: any[] }): Promise<string> {
        console.log('Datos recibidos:', body);

        try {
            const jsCode = JavaScriptConverter.convertToJavaScript(body.nodeDataArray, body.linkDataArray);
            // 'YourJavaConverter' es la clase o función que convierte los datos de GoJS a código Java.
            // Debes implementarla o importarla adecuadamente según tu estructura de proyecto.

            // Guarda el código Java en tu base de datos o donde lo necesites
            // ...

            return jsCode;
        } catch (error) {
            // Maneja errores de conversión aquí
            throw new Error(`Error al convertir a código JavaScript: ${error.message}`);
        }
    }
}
