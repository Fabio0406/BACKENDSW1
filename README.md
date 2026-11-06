# MeetFlow Backend — API para diagramas de secuencia colaborativos

Backend en **NestJS** de MeetFlow, un editor de **diagramas de secuencia UML** donde varios usuarios trabajan a la vez en una "reunión". Gestiona usuarios, reuniones y diagramas, sincroniza los cambios en tiempo real con **Socket.IO** y **convierte el diagrama en código Java, Python o JavaScript**.

Forma parte de un sistema de dos repositorios:

| Repositorio | Rol |
|---|---|
| **Meetflow-Backend** (este) | API REST + WebSocket |
| [Meetflow-Frontend](https://github.com/Fabio0406/Meetflow-Frontend) | Frontend en React + GoJS |

> Proyecto académico — Ingeniería de Software I, UAGRM (2024).

## Funcionalidades

- **Usuarios**: registro e inicio de sesión con contraseñas cifradas (bcrypt) y token JWT.
- **Reuniones**: cada reunión tiene un código y una contraseña para que otros usuarios se unan.
- **Colaboradores**: registro de los usuarios que participan en cada reunión.
- **Diagramas**: se guardan como JSON (formato de GoJS: `nodeDataArray` y `linkDataArray`).
- **Tiempo real** (Socket.IO, namespace `/reunion`): crear o unirse a una reunión y transmitir los cambios del diagrama a todos los participantes.
- **Exportación a SVG**: guarda la imagen del diagrama en la base de datos y en `src/public/`, accesible desde `/public/<id>.svg`.
- **Generación de código** a partir del diagrama: **Java**, **Python** y **JavaScript**. Cada línea de vida se convierte en una clase y cada mensaje en un método.

## Tecnologías

- NestJS 10 (TypeScript)
- TypeORM + PostgreSQL
- Socket.IO (`@nestjs/websockets`, `@nestjs/platform-socket.io`)
- bcrypt, jsonwebtoken
- `@nestjs/serve-static` para archivos públicos
- Desplegado en Railway

## Estructura

```
src/
├── main.ts                    # Arranque, CORS y adaptador de Socket.IO
├── app.module.ts              # Conexión a PostgreSQL y módulos
├── entity/                    # usuario, reunion, diagrama, colaborador
├── user/                      # Registro y login
├── reunion/                   # Reuniones, SVG y generación de código
│   ├── convertJava.ts
│   ├── convertPython.ts
│   └── convertJavaScript.ts
├── diagrama/                  # CRUD de diagramas
├── colaborador/               # Agregar colaboradores
├── websocket/                 # Gateway de Socket.IO
├── public/                    # SVG generados
└── pruebas.js                 # Script que simula varios clientes Socket.IO
```

## Requisitos

- Node.js 18 o superior
- PostgreSQL 12 o superior

## Instalación

```bash
npm install
```

### Configuración

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto `3001`) |
| `DATABASE_URL` | Conexión a PostgreSQL, por ejemplo `postgresql://usuario:contraseña@localhost:5432/meetflowdb` |
| `JWT_SECRET` | Texto largo y aleatorio para firmar los tokens de sesión |

El archivo `.env` está en `.gitignore`. **No lo subas al repositorio.**

### Base de datos

Solo crea la base vacía; TypeORM crea las tablas solo al arrancar (`synchronize: true`):

```bash
createdb -U postgres meetflowdb
```

### Ejecutar

```bash
npm run start:dev
```

El servidor corre en `http://localhost:3001`.

## Endpoints REST

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/user/register` | Registrar usuario |
| POST | `/user/login` | Iniciar sesión (devuelve un JWT) |
| POST | `/reuniones` | Crear reunión |
| GET | `/reuniones/:idUsuario/reuniones` | Reuniones de un usuario |
| POST | `/reuniones/validar` | Validar el código y la contraseña de una reunión |
| POST | `/reuniones/savesvg` | Guardar el SVG del diagrama |
| POST | `/reuniones/java` | Convertir el diagrama a Java |
| POST | `/reuniones/python` | Convertir el diagrama a Python |
| POST | `/reuniones/javascript` | Convertir el diagrama a JavaScript |
| POST | `/diagrama/crearDiagrama` | Crear diagrama |
| GET | `/diagrama/obtenerDiagrama/:idDiagrama` | Obtener un diagrama |
| GET | `/diagrama/obtenerDiagramaIdReunion/:idReunion` | Diagrama de una reunión |
| POST | `/colaborador/agregar` | Agregar colaborador a una reunión |

## Eventos de Socket.IO (namespace `/reunion`)

| Evento que envía el cliente | Respuesta del servidor |
|---|---|
| `crearReunion` | `reunionCreada` o `errorCreacionReunion` |
| `unirseReunion` | `unirseReunionExitoso` (y `usuarioUnido` al resto) o `errorUnirseReunion` |
| `actualizarDiagrama` | `actualizarDiagramas` a los demás participantes |
| `guardarDiagrama` | Guarda el diagrama y lo envía a la sala |
