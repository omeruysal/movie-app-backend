import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from './user.entity';

@Entity()
export class CommentMovie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @ManyToOne(() => User, (user) => user.movieComments)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.comments, { onDelete: 'CASCADE' })
  movie: Movie;

  @CreateDateColumn()
  createdAt: Date;
}
