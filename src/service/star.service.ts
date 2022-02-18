import { getConnection, getManager, getRepository } from 'typeorm';
import { Star } from '../entity/star.entity';
import { User } from '../entity/user.entity';
import GlobalError from '../utils/appError';
import { filterObj } from '../utils/filterObject';
interface PaginationStar {
  data: Partial<Star[]>;
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}
export const addStar = async (star: Partial<Star>, user: User): Promise<Partial<Star>> => {
  try {
    const data = Star.create({
      ...star,
      user,
    });
    await data.save();
    return data;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getAllStars = async (page: number, take: number): Promise<PaginationStar> => {
  try {
    const value = await getRepository(Star)
      .createQueryBuilder('star')
      .select(['star.id', 'star.name', 'star.image', 'user.username'])
      .leftJoin('star.user', 'user')
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();

    return {
      data: value[0],
      meta: {
        total: value[1],
        page,
        last_page: Math.ceil(value[1] / take),
      },
    };
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getStarsByUserId = async (id: string, page: number, take: number): Promise<PaginationStar> => {
  try {
    const [data, total] = await Star.findAndCount({ where: { user: { id } }, take, skip: (page - 1) * take });
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

export const getStarById = async (id: string): Promise<Partial<Star | undefined>> => {
  try {
    const star = await Star.findOne(id);

    return star;
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const getStarsByUsername = async (username: string, page: number, take: number): Promise<PaginationStar> => {
  try {
    const [data, total] = await getRepository(Star)
      .createQueryBuilder('star')
      .orderBy('star.createdAt', 'DESC')
      .select(['star.id', 'star.name', 'star.description', 'star.image', 'star.age', 'star.createdAt', 'user.username'])
      .leftJoin('star.user', 'user')
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

export const updateStarById = async (starId: string, body: Partial<User>, userId: string): Promise<void> => {
  try {
    const filteredObject = filterObj(body, 'name', 'age', 'description', 'image');

    const star = await Star.find({ where: { user: { id: userId } } });
    if (!star) throw new GlobalError('Movie star not found', 404);

    await getConnection()
      .createQueryBuilder()
      .update(Star)
      .set({ ...filteredObject })
      .where('id = :id', { id: starId })
      .andWhere('userId = :userId', { userId })
      .execute();
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};

export const deleteStarById = async (id: string, userId: string): Promise<void> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Star)
      .where('id = :id', { id })
      .andWhere('userId = :userId', { userId })
      .execute();
  } catch (error: any) {
    throw new GlobalError(error.message);
  }
};
