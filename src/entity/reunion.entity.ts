import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { usuario } from './user.entity';
import { diagrama } from './diagrama.entity';
import { colaborador } from './colaborado.entity';

@Entity()
export class reunion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  diagramaid: number;

  @Column({ nullable: true })
  usuarioid: number;

  @Column({ nullable: true })
  svg: string;

  @ManyToOne(() => usuario, usuario => usuario.reuniones)
  usuario: usuario;

  // Establecer relación uno a uno con diagrama
  @OneToOne(() => diagrama, diagrama => diagrama.reunion, { cascade: true, eager: true })
  @JoinColumn()
  diagrama: diagrama;

  @ManyToMany(() => usuario, usuario => usuario.reunionesColaborador)
  @JoinTable()
  colaboradores: usuario[];

  @OneToMany(() => colaborador, colaborador => colaborador.reunion)
    colaboradoresre: colaborador[];
}
