import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new User', async () => {
    const user = await createUser.execute({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123123123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create User with an already used email adress', async () => {
    await createUser.execute({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123123123',
    });

    await expect(
      createUser.execute({
        name: 'Zé das Couves',
        email: 'ze@couves.com',
        password: '123123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
