import User from '@modules/users/infra/typeorm/entities/User';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

import { uuid } from 'uuidv4';

class FakeUserTokensRepository implements IUserTokensRepository {
  private usertokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, { id: uuid(), token: uuid(), user_id });

    this.usertokens.push(userToken);

    return userToken;
  }
}
export default FakeUserTokensRepository;
