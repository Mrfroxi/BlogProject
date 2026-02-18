import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

@injectable()
export class BcryptService {
  async userPasswordBcrypt(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async userPasswordCompare(password: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }
}

export const bcryptService = new BcryptService();
