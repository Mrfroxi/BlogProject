import { Request, Response } from 'express';
import { userService } from '../../services/user.service';
import { errorHandler } from '../../../../core/errors/handler/errorHandler';
import { HttpStatuses } from '../../../../core/types/http-statuses';
import { userRepository } from '../../repositories/user.repository';
import { AdminUserOutputDto } from '../../dto/user-output.dto';

export const createUserHandler = async (req: Request, res: Response) => {
  const reqBody = req.body;

  try {
    const createdUserId: string = await userService.createAdminUser(reqBody);

    const user: AdminUserOutputDto | null = await userRepository.findAdminUserById(createdUserId);

    res.status(HttpStatuses.Created).send(user);
  } catch (e: unknown) {
    errorHandler(e, res);
  }
};
