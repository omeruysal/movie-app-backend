import { parse } from 'path/posix';
import { getRepository } from 'typeorm';
import { CommentMovie } from '../entity/comment_movie.entity';
import { CommentStar } from '../entity/comment_star.entity';
import { Star } from '../entity/star.entity';
import { User } from '../entity/user.entity';
import GlobalError from '../utils/appError';
import { getMovieById } from './movie.service';
import { getStarById, getStarsByUserId } from './star.service';
import { getUserById } from './user.service';
interface PaginationCommentMovie {
  data: Partial<CommentMovie[]>;
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}
interface PaginationCommentStar {
  data: Partial<CommentStar[]>;
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}
export const getCommentsByMovieId = async (
  movieId: string,
  page: number,
  take: number
): Promise<Partial<PaginationCommentMovie>> => {
  try {
    const [data, total] = await getRepository(CommentMovie)
      .createQueryBuilder('comment_movie')
      .orderBy('comment_movie.createdAt', 'DESC')
      .select(['comment_movie.id', 'comment_movie.description', 'comment_movie.createdAt', 'user.username'])
      .leftJoin('comment_movie.user', 'user')
      .where('comment_movie.movieId = :movieId', { movieId })
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getCommentsByStarId = async (
  starId: string,
  page: number,
  take: number
): Promise<Partial<PaginationCommentStar>> => {
  try {
    const [data, total] = await getRepository(CommentStar)
      .createQueryBuilder('comment_star')
      .orderBy('comment_star.createdAt', 'DESC')
      .select(['comment_star.id', 'comment_star.description', 'comment_star.createdAt', 'user.username'])
      .leftJoin('comment_star.user', 'user')
      .where('comment_star.starId = :starId', { starId })
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();

    console.log(data);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const saveCommentToStar = async (
  description: string,
  id: string,
  userId: string
): Promise<Partial<CommentStar>> => {
  try {
    const star = await getStarById(id);
    const user = await getUserById(userId);
    const comment = await CommentStar.create({
      description,
      user,
      star,
    });
    await comment.save();

    return comment;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const saveCommentToMovie = async (
  description: string,
  id: string,
  userId: string
): Promise<Partial<CommentMovie>> => {
  try {
    const movie = await getMovieById(id);
    const user = await getUserById(userId);
    const comment = await CommentMovie.create({
      description,
      user,
      movie,
    });
    await comment.save();
    //TODOtum yorumlar dondurulebilir
    return comment;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getCommentsCountByMovieId = async (id: string): Promise<Number> => {
  try {
    const count = await CommentMovie.count({ where: { movie: { id } } });
    return count;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getCommentsCountByStarId = async (id: string): Promise<Number> => {
  try {
    const count = await CommentStar.count({ where: { star: { id } } });
    return count;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};
