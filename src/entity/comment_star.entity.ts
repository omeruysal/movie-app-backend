import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Star } from './star.entity';
import { User } from './user.entity';

@Entity()
export class CommentStar extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 225 })
  description: string;

  @ManyToOne(() => User, (user) => user.starComments)
  user: User;

  @ManyToOne(() => Star, (star) => star.comments, { onDelete: 'CASCADE' })
  star: Star;

  @CreateDateColumn()
  createdAt: Date;
}
