import { check } from 'express-validator';
import { getUserByUsername, getUserByEmail } from '../service/user.service';

export const RegisterValidation = [
  check('username')
    .notEmpty()
    .withMessage('Username can not be null')
    .bail() // if username is null then it does not go on
    .isLength({ min: 4, max: 32 })
    .withMessage('Must have min 4 and max 32 characters')
    .bail()
    .custom(async (username) => {
      const user = await getUserByUsername(username);
      if (user) {
        throw new Error('Username in use');
      }
    }),
  check('email')
    .notEmpty()
    .withMessage('Email can not be null')
    .bail()
    .isEmail()
    .withMessage('Email is not valid')
    .bail()
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (user) {
        throw new Error('Email in use');
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('Password can not be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const LoginValidation = [
  check('email').notEmpty().withMessage('Email can not be null').bail().isEmail(),
  check('password')
    .notEmpty()
    .withMessage('Password can not be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const UpdateMeValidation = [
  check('username')
    .notEmpty()
    .withMessage('Username can not be null')
    .bail() // if username is null then it does not go on
    .isLength({ min: 4, max: 32 })
    .withMessage('Must have min 4 and max 32 characters')
    .bail()
    .custom(async (username) => {
      const user = await getUserByUsername(username);
      if (user) {
        throw new Error('Username in use');
      }
    }),
  check('email')
    .notEmpty()
    .withMessage('Email can not be null')
    .bail()
    .isEmail()
    .withMessage('Email is not valid')
    .bail()
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (user) {
        throw new Error('Email in use');
      }
    }),
];

export const UpdatePasswordValidation = [
  check('password')
    .notEmpty()
    .withMessage('Password can not be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];
