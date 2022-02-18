import { parse } from 'path/posix';
import { getConnection, getRepository, Like } from 'typeorm';
import { LikeMovie } from '../entity/like_movie.entity';
import { LikeStar } from '../entity/like_star.entity';
import { Movie } from '../entity/movie.entity';
import { Star } from '../entity/star.entity';
import GlobalError from '../utils/appError';
import { getMovieById } from './movie.service';
import { getStarById, getStarsByUserId } from './star.service';
import { getUserById } from './user.service';

export const getLikesCountByMovieId = async (id: string): Promise<Number> => {
  try {
    const count = await LikeMovie.count({ where: { movie: { id } } });

    return count;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getLikesCountByStarId = async (id: string): Promise<Number> => {
  try {
    const count = await LikeStar.count({ where: { star: { id } } });
    return count;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const saveLikeToStar = async (starId: string, userId: string): Promise<Partial<LikeStar>> => {
  try {
    const star = await getStarById(starId);
    const user = await getUserById(userId);
    const like = await LikeStar.create({
      user,
      star,
    });
    await like.save();

    return like;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const saveLikeToMovie = async (movieId: string, userId: string): Promise<Partial<LikeMovie>> => {
  try {
    const movie = await getMovieById(movieId);
    const user = await getUserById(userId);
    const like = await LikeMovie.create({
      user,
      movie,
    });
    await like.save();

    return like;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const removeLikeToStar = async (starId: string, userId: string): Promise<void> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Star)
      .where('id = :starId,userId=:userId', { starId, userId })
      .execute();
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const removeLikeToMovie = async (movieId: string, userId: string): Promise<void> => {
  try {
    const res = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(LikeMovie)
      .where('movieId = :movieId', { movieId })
      .andWhere('userId = :userId', { userId })
      .execute();
  } catch (error: any) {
    console.log(error);

    throw new GlobalError(error.message);
  }
};

export const isLikeExistOnMovie = async (movieId: string, userId: string): Promise<Number> => {
  try {
    const count = await getRepository(LikeMovie)
      .createQueryBuilder('like_movie')
      .where('like_movie.movieId = :movieId', { movieId })
      .andWhere('like_movie.userId = :userId', { userId })
      .getCount();

    return count;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const isLikeExistOnStar = async (starId: string, userId: string): Promise<Number> => {
  try {
    const count = await getRepository(LikeStar)
      .createQueryBuilder('like_star')
      .where('like_star.starId = :starId', { starId })
      .andWhere('like_star.userId = :userId', { userId })
      .getCount();

    return count;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};
