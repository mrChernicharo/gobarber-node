import FakeUsersRepository from '@modules/users/repositories/fakes/fakeUsersRepository';
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new User', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const user = await createUser.execute({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123123123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create User with an already used email adress', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123123123',
    });

    expect(
      createUser.execute({
        name: 'Zé das Couves',
        email: 'ze@couves.com',
        password: '123123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
