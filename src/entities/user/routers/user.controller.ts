import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { UserService } from '../services/user.service';
import { UserQueryRepository } from '../repositories/user-query.repository';
import { UserRepository } from '../repositories/user.repository';
import { DefaultValuesSortingDto } from '../dto/default-values-sorting.dto';
import { matchedData } from 'express-validator';
import { UserListOutputDto } from '../dto/user-list-output.dto';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorHandler } from '../../../core/errors/handler/errorHandler';
import { AdminUserOutputDto } from '../dto/user-output.dto';
import { ResultType } from '../../../core/object-result/result.type';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';

@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(UserQueryRepository) private userQueryRepository: UserQueryRepository,
    @inject(UserRepository) private userRepository: UserRepository
  ) {}

  async getUserList(req: Request, res: Response) {
    try {
      const matchSortingData: DefaultValuesSortingDto = matchedData(req, {
        locations: ['query'],
        includeOptionals: true,
      });

      const userList: UserListOutputDto = await this.userQueryRepository.findAll(matchSortingData);

      res.status(HttpStatuses.Ok).send(userList);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async createUser(req: Request, res: Response) {
    const reqBody = req.body;

    try {
      const createdUserId: string = await this.userService.createAdminUser(reqBody);

      const user: AdminUserOutputDto | null =
        await this.userRepository.findAdminUserById(createdUserId);

      res.status(HttpStatuses.Created).send(user);
    } catch (e: unknown) {
      errorHandler(e, res);
    }
  }

  async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;

    const isDelete: ResultType<boolean | null> = await this.userService.deleteUser(userId);

    if (isDelete.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(isDelete.status)).send(isDelete.extensions);
    }

    res.sendStatus(HttpStatuses.NoContent);
  }
}
