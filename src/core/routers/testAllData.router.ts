import { Router, Request, Response } from 'express';
import { HttpStatuses } from '../types/http-statuses';
import { BlogModel } from '../../db/schemas/blog.schema';
import { PostModel } from '../../db/schemas/post.schema';
import { UserModel } from '../../db/schemas/user.schema';
import { CommentModel } from '../../db/schemas/comment.schema';

export const testAllDataRouter = Router({});

testAllDataRouter.delete('/all-data', async (_req: Request, res: Response) => {
  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    UserModel.deleteMany(),
    CommentModel.deleteMany(),
  ]);

  res.sendStatus(HttpStatuses.NoContent);
});
