import { IUser } from '../../../../db/schemas/user.schema';
import { mapUserToOutput } from './map-user-to-output';
import { UserOutputDto } from '../../dto/user-output.dto';

export const mapUserListToOutput = (userList: IUser[]): UserOutputDto[] => {
  return userList.map((elem) => {
    return mapUserToOutput(elem);
  });
};
