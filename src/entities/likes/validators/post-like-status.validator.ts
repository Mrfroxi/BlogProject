import { body } from 'express-validator';
import { PostLikeStatus } from '../../../db/schemas/post-like.schema';

export const postLikeStatusValidator = [
  body('likeStatus')
    .exists()
    .withMessage('likeStatus is required')
    .isIn([PostLikeStatus.None, PostLikeStatus.Like, PostLikeStatus.Dislike])
    .withMessage('likeStatus must be "None", "Like" or "Dislike"'),
];
