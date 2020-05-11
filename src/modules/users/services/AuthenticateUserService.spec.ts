import FakeUsersRepository from '@modules/users/repositories/fakes/fakeUsersRepository';
import AppError from '@shared/errors/AppError';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authenticate User', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123123123',
    });

    const response = await authenticateUser.execute({
      email: 'ze@couves.com',
      password: '123123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate an unexisting user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    expect(
      authenticateUser.execute({
        email: 'ze@couves.com',
        password: '123123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123123123',
    });

    expect(
      authenticateUser.execute({
        email: 'ze@couves.com',
        password: 'wrong password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
