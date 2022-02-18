import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentStar } from './comment_star.entity';
import { LikeStar } from './like_star.entity';
import { User } from './user.entity';

@Entity()
export class Star extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column()
  description: string;

  @Column()
  age: string;

  @ManyToOne(() => User, (user) => user.stars, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CommentStar, (comment) => comment.star)
  comments: CommentStar[];

  @OneToMany(() => LikeStar, (like) => like.star)
  likes: LikeStar[];

  @CreateDateColumn()
  createdAt: Date;
}
