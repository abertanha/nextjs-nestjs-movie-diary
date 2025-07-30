import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('filmes')
export class Filme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'varchar', length: 150 })
  diretor: string;

  @Column({ type: 'integer' })
  ano: number;

  @Column({ type: 'varchar' })
  genero: string;

  @Column({ type: 'integer' })
  duracao: number;

  @Column({ type: 'text' })
  elenco: string;

  @Column({ length: 50 })
  classificacao: string;

  @Column({ type: 'text' })
  sinopse: string;

  @Column({ type: 'decimal', nullable: true })
  notaUsuario: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  posterUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  backdropUrl: string | null;

  @CreateDateColumn()
  dataAdicao: Date;

  @ManyToOne(() => User, (user) => user.filmes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
