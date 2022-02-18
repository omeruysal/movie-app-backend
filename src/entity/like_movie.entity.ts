import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from './user.entity';

@Entity()
export class LikeMovie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, (user) => user.movieLikes)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.comments, { onDelete: 'CASCADE' })
  movie: Movie;
}
