import { throws } from 'assert';
import { nextTick } from 'process';
import { getConnection, getManager, getRepository } from 'typeorm';
import { Movie } from '../entity/movie.entity';
import { User } from '../entity/user.entity';
import GlobalError from '../utils/appError';
import { filterObj } from '../utils/filterObject';

interface PaginationMovie {
  data: Partial<Movie[]>;
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

export const addMovie = async (movie: Partial<Movie>, user: User): Promise<Partial<Movie>> => {
  try {
    const data = await Movie.create({
      ...movie,
      user,
    });
    await data.save();

    return data;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getMoviesPagination = async (page: number, take: number): Promise<PaginationMovie> => {
  try {
    const [data, total] = await getRepository(Movie)
      .createQueryBuilder('movie')
      .select(['movie.id', 'movie.name', 'user.username', 'movie.image'])
      .leftJoin('movie.user', 'user')
      .where('user.showMovie =:result', { result: 1 })
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

export const deleteMovieById = async (id: string, userId: string): Promise<void> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Movie)
      .where('id = :id', { id })
      .andWhere('userId=:userId', { userId })
      .execute();
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getMoviesByUserId = async (id: string): Promise<Partial<Movie[]>> => {
  try {
    const movies = await Movie.find({ where: { user: { id } } });
    return movies;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getMoviesByUsername = async (username: string, page: number, take: number): Promise<PaginationMovie> => {
  try {
    const [data, total] = await getRepository(Movie)
      .createQueryBuilder('movie')
      .orderBy('movie.createdAt', 'DESC')
      .select([
        'movie.id',
        'movie.name',
        'movie.image',
        'movie.description',
        'movie.runTime',
        'movie.genre',
        'movie.createdAt',
        'user.username',
      ])
      .leftJoin('movie.user', 'user')
      .where('user.username = :username', { username })
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

export const getMoviesByAuthId = async (id: string): Promise<Partial<Movie[]>> => {
  try {
    const movies = await Movie.find({ where: { user: { id } } });
    return movies;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getMovieById = async (id: string): Promise<Partial<Movie | undefined>> => {
  try {
    const movie = await Movie.findOne(id);

    return movie;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const updateMovieById = async (movieId: string, body: Partial<User>, userId: string): Promise<void> => {
  try {
    const filteredObject = filterObj(body, 'name', 'genre', 'description', 'image', 'runTime');

    const movie = await Movie.find({ where: { user: { id: userId } } });
    if (!movie) throw new GlobalError('Movie not found', 404);

    await getConnection()
      .createQueryBuilder()
      .update(Movie)
      .set({ ...filteredObject })
      .where('id = :id', { id: movieId })
      .andWhere('userId = :userId', { userId })
      .execute();
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};
