import { UserModel, IUser } from '../../../db/schemas/user.schema';
import { DefaultValuesSortingDto } from '../dto/default-values-sorting.dto';
import { mapUserListToOutput } from './mappers/map-user-list-to-output';
import { UserOutputDto } from '../dto/user-output.dto';
import { UserListOutputDto } from '../dto/user-list-output.dto';
import { mapUserAuthMeToOutput } from './mappers/map-userAuthMe-to-output';
import { UserCredentials } from '../../../auth/dto/userCredentialsDto';
import { injectable } from 'inversify';

@injectable()
export class UserQueryRepository {
  async findAll(sortingDefault: DefaultValuesSortingDto): Promise<UserListOutputDto> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } =
      sortingDefault;

    const orFilter: any[] = [];

    if (searchLoginTerm) {
      orFilter.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }

    if (searchEmailTerm) {
      orFilter.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    const filter = orFilter.length > 0 ? { $or: orFilter } : {};

    const skip = (pageNumber - 1) * pageSize;
    const sortDirMongo = sortDirection === 'asc' ? 1 : -1;

    const userList: IUser[] = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirMongo })
      .skip(skip)
      .limit(pageSize);

    const totalCount: number = await UserModel.countDocuments(filter);

    const pagesCount: number = Math.ceil(totalCount / pageSize);

    const mappedUserList: UserOutputDto[] = mapUserListToOutput(userList);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: mappedUserList,
    };
  }

  async checkUserCredentials(loginOrEmail: string): Promise<UserCredentials | null> {
    const user: IUser | null = await UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      hashPassword: user.password,
    };
  }

  async AuthMeById(id: string) {
    const user: IUser | null = await UserModel.findById(id);

    if (!user) {
      return null;
    }

    return mapUserAuthMeToOutput(user);
  }
}
