import { userCollection } from '../../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { User } from '../types/user';
import { mapUserToOutput } from './mappers/map-user-to-output';
import { AdminUserOutputDto, UserOutputDto } from '../dto/user-output.dto';
import { mapAdminUserToOutput } from './mappers/map-adminUser-to-output';
import { UserCredentials } from '../../../auth/dto/userCredentialsDto';
import { injectable } from 'inversify';

@injectable()
export class UserRepository {
  async findUserById(id: string): Promise<UserOutputDto | null> {
    const user: WithId<User> | null = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }

    return mapUserToOutput(user);
  }

  async findAdminUserById(id: string): Promise<AdminUserOutputDto | null> {
    const user: WithId<User> | null = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }

    return mapAdminUserToOutput(user);
  }

  async createUser(dto: User) {
    return userCollection.insertOne(dto);
  }

  async deleteUserById(userId: string) {
    //Returns true if deleted, otherwise false
    const isDeleted = await userCollection.deleteOne({ _id: new ObjectId(userId) });

    return isDeleted.deletedCount === 1 && isDeleted.acknowledged;
  }

  async userUniqueLogin(userLogin: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ login: userLogin });
  }

  async userUniqueEmail(userEmail: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ email: userEmail });
  }

  async userVerifyCode(userCode: string): Promise<UserOutputDto | null> {
    const user: WithId<User> | null = await userCollection.findOne({
      'emailConfirmation.confirmationCode': userCode,
    });

    if (!user) {
      return null;
    }

    return mapUserToOutput(user);
  }

  async userSwitchEmailIsConfirmed(userId: string) {
    const switchedUser = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'emailConfirmation.isConfirmed': true } }
    );

    return switchedUser.acknowledged;
  }

  async userChangeConfirmedCode(userEmail: string, newCode: string) {
    const switchedUser = await userCollection.updateOne(
      { email: userEmail },
      { $set: { 'emailConfirmation.confirmationCode': newCode } }
    );

    return switchedUser.acknowledged;
  }

  async checkUserCredentials(loginOrEmail: string): Promise<UserCredentials | null> {
    const user: WithId<User> | null = await userCollection.findOne({
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
