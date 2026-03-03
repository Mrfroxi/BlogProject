import { body } from 'express-validator';
import { LikeStatus } from '../../../db/schemas/likes.shema';

export const dataValidator = body('content')
  .trim()
  .isString()
  .withMessage('must be a string')
  .isLength({ min: 20, max: 300 })
  .withMessage('min-max password length 20-300');

export const likeStatusValidator = body('likeStatus')
  .exists()
  .withMessage('likeStatus is required')
  .isIn([LikeStatus.None, LikeStatus.Like, LikeStatus.Dislike])
  .withMessage('likeStatus must be "None", "Like" or "Dislike"');
