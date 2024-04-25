import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { usuario } from './user.entity';
import { reunion } from './reunion.entity';

@Entity()
export class diagrama {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'json' , nullable: true }) // Almacena datos del diagrama como JSON
  contenido: any;

  @Column()
  idusuario: number;

  @Column({ nullable: true })
  idreunion: number;

  // Establecer relación muchos a uno con usuario
  @ManyToOne(() => usuario, usuario => usuario.diagramas)
  usuario: usuario;

  // Establecer relación uno a uno con reunión
  @OneToOne(() => reunion, reunion => reunion.diagrama)
  reunion: reunion;
}
