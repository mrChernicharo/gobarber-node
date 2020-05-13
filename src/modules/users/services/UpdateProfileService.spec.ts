import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123456',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Zé das Alface',
      email: 'ze@alface.com',
    });

    expect(updateUser.name).toBe('Zé das Alface');
    expect(updateUser.email).toBe('ze@alface.com');
  });

  it('should not be able to update email using an address already in use', async () => {
    await fakeUsersRepository.create({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Zé das Alface',
      email: 'ze@alface.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Zé da Alface',
        email: 'ze@couves.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123456',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Zé das Alface',
      email: 'ze@alface.com',
      old_password: '123456',
      password: '222222',
    });

    expect(updateUser.password).toBe('222222');
  });

  it('should not be able to update password without informing the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Zé das Alface',
        email: 'ze@alface.com',
        // old_password: '123456',
        password: '222222',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password if infomed old password is wrong', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Zé das Alface',
        email: 'ze@alface.com',
        old_password: 'wrong-old-password',
        password: '222222',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to show profile from non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'sujeito-nao-existente.',
        name: 'nobody',
        email: 'no@body.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
