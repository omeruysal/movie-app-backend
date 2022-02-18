import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Star } from './star.entity';
import { Movie } from './movie.entity';
import { LikeMovie } from './like_movie.entity';
import { LikeStar } from './like_star.entity';
import { CommentMovie } from './comment_movie.entity';
import { CommentStar } from './comment_star.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  lastName: string;

  @Column({
    unique: true,
    type: 'varchar',
  })
  email: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  showMovie: boolean;

  @Column()
  showStar: boolean;

  @OneToMany(() => Movie, (movie) => movie.user)
  movies: Movie[];

  @OneToMany(() => Star, (star) => star.user)
  stars: Star[];

  @OneToMany(() => CommentStar, (comment) => comment.user)
  starComments: CommentStar[];

  @OneToMany(() => CommentMovie, (comment) => comment.user)
  movieComments: CommentMovie[];

  @OneToMany(() => LikeMovie, (like) => like.user)
  movieLikes: LikeMovie[];

  @OneToMany(() => LikeStar, (like) => like.user)
  starLikes: LikeStar[];
}
