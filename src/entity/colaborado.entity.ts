import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { reunion } from './reunion.entity';

@Entity()
export class colaborador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  usuarioId: number;

  @Column({nullable: true})
  reunionId: number;

  @ManyToOne(() => reunion, reunion => reunion.colaboradores)
    @JoinColumn({ name: 'reunionId' })
    reunion: reunion;
}
