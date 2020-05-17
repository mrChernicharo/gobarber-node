import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CachePrrovider/fakes/FakeCacheProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to authenticate User', async () => {
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
    expect(
      authenticateUser.execute({
        email: 'ze@couves.com',
        password: '123123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with wrong password', async () => {
    await createUser.execute({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'ze@couves.com',
        password: 'wrong password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
