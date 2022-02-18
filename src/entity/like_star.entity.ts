import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Star } from './star.entity';
import { User } from './user.entity';

@Entity()
export class LikeStar extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, (user) => user.starLikes)
  user: User;

  @ManyToOne(() => Star, (star) => star.likes, { onDelete: 'CASCADE' })
  star: Star;
}
