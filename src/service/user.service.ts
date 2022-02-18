import { nextTick } from 'process';
import { createQueryBuilder, getManager, getRepository } from 'typeorm';
import { Movie } from '../entity/movie.entity';
import { Star } from '../entity/star.entity';
import { User } from '../entity/user.entity';
import GlobalError from '../utils/appError';
import { filterObj } from '../utils/filterObject';

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  try {
    const user = await User.findOne({ email });

    return user;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getUserByUsername = async (username: string): Promise<User | undefined> => {
  try {
    const user = await User.findOne({ username });

    return user;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const saveUser = async (user: Partial<User>): Promise<Partial<User>> => {
  try {
    const data = User.create({
      ...user,
      showMovie: true,
      showStar: true,
    });
    await data.save();

    return data;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getAllUsers = async (): Promise<User[] | undefined> => {
  try {
    const users = await User.find();

    return users;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    const user = await User.findOne(id);

    return user;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const updateUser = async (userId: string, body: Partial<User>): Promise<Partial<User> | undefined> => {
  try {
    const filteredObject = filterObj(body, 'username', 'firstName', 'lastName', 'image', 'email');
    await User.update(userId, filteredObject);

    const user = await User.findOne(userId);

    if (!user) throw new GlobalError('User not found', 404);
    const { password, ...data } = user;

    return data;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const updatePassword = async (userId: string, body: Partial<User>): Promise<Partial<User> | undefined> => {
  try {
    const filteredObject = filterObj(body, 'password');

    const user = await User.findOne(userId);

    if (!user) throw new GlobalError('User not found', 404);

    await User.update(userId, filteredObject);

    const { password, id, ...data } = user;
    return data;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const areMoviesPublic = async (movieId: string): Promise<number> => {
  try {
    const result = await getRepository(Movie)
      .createQueryBuilder('movie')
      .select(['movie.id', 'movie.name', 'user.username'])
      .leftJoin('movie.user', 'user')
      .where('movie.id = :movieId', { movieId })
      .andWhere('user.showMovie = :showMovie', { showMovie: 1 })
      .getCount();

    return result;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const areStarsPublic = async (starId: string): Promise<number> => {
  try {
    const result = await getRepository(Star)
      .createQueryBuilder('star')
      .select(['star.id', 'star.name', 'user.username'])
      .leftJoin('star.user', 'user')
      .where('star.id = :starId', { starId })
      .andWhere('user.showStar = :showStar', { showStar: 1 })
      .getCount();

    return result;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const updatePublicMovieProperty = async (id: string, value: boolean): Promise<void> => {
  try {
    await User.update(id, { showMovie: value });
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};
export const updatePublicStarProperty = async (id: string, value: boolean): Promise<void> => {
  try {
    await User.update(id, { showStar: value });
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};
