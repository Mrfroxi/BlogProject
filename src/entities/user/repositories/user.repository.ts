import { UserModel, IUser } from '../../../db/schemas/user.schema';
import { User } from '../types/user';
import { mapUserToOutput } from './mappers/map-user-to-output';
import { AdminUserOutputDto, UserOutputDto } from '../dto/user-output.dto';
import { mapAdminUserToOutput } from './mappers/map-adminUser-to-output';
import { UserCredentials } from '../../../auth/dto/userCredentialsDto';
import { injectable } from 'inversify';

@injectable()
export class UserRepository {
  async findUserById(id: string): Promise<UserOutputDto | null> {
    const user: IUser | null = await UserModel.findById(id);

    if (!user) {
      return null;
    }

    return mapUserToOutput(user);
  }

  async findUserByEmailCode(code: string): Promise<UserOutputDto | null> {
    const user: IUser | null = await UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });

    if (!user) {
      return null;
    }

    return mapUserToOutput(user);
  }

  async findAdminUserById(id: string): Promise<AdminUserOutputDto | null> {
    const user: IUser | null = await UserModel.findById(id);

    if (!user) {
      return null;
    }

    return mapAdminUserToOutput(user);
  }

  async createUser(dto: User): Promise<IUser> {
    return await UserModel.create(dto);
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: userId });
    return result.deletedCount === 1;
  }

  async userUniqueLogin(userLogin: string): Promise<IUser | null> {
    return UserModel.findOne({ login: userLogin });
  }

  async userUniqueEmail(userEmail: string): Promise<IUser | null> {
    return UserModel.findOne({ email: userEmail });
  }

  async userVerifyCode(userCode: string): Promise<UserOutputDto | null> {
    const user: IUser | null = await UserModel.findOne({
      'emailConfirmation.confirmationCode': userCode,
    });

    if (!user) {
      return null;
    }

    return mapUserToOutput(user);
  }

  async userSwitchEmailIsConfirmed(userId: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: userId },
      { $set: { 'emailConfirmation.isConfirmed': true } }
    );
    return result.modifiedCount === 1;
  }

  async userChangeConfirmedCode(userEmail: string, newCode: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { email: userEmail },
      { $set: { 'emailConfirmation.confirmationCode': newCode } }
    );
    return result.modifiedCount === 1;
  }

  async updateUserPasswordByCode(recoveryCode: string, passwordHash: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { 'emailConfirmation.confirmationCode': recoveryCode },
      { $set: { password: passwordHash } }
    );
    return result.modifiedCount === 1;
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
}
