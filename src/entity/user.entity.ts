import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { reunion } from './reunion.entity';
import { diagrama } from './diagrama.entity';

@Entity()
export class usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ci: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;
  
  @Column()
  direccion: string;

  @Column()
  telefono: number;

  @Column()
  contrasena: string;

  @OneToMany(() => reunion, reunion => reunion.usuario)
  reuniones: reunion[];

  // Establecer la relación uno a muchos con diagramas
  @OneToMany(() => diagrama, diagrama => diagrama.id)
  diagramas: diagrama[];

  @ManyToMany(() => reunion, reunion => reunion.colaboradores)
  @JoinTable()
  reunionesColaborador: reunion[];
}