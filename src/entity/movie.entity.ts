import {
  BaseEntity,
  Column,
  Entity,
  ChildEntity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { CommentMovie } from './comment_movie.entity';
import { LikeMovie } from './like_movie.entity';
import { User } from './user.entity';
@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  description: string;

  @Column()
  genre: string;

  @Column({ nullable: true })
  runTime: number;

  @ManyToOne(() => User, (user) => user.movies, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CommentMovie, (comment) => comment.movie)
  comments: CommentMovie[];

  @OneToMany(() => LikeMovie, (like) => like.movie)
  likes: LikeMovie[];

  @CreateDateColumn()
  createdAt: Date;
}
