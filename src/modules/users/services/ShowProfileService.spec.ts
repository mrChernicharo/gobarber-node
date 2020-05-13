import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;
describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to Show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Zé das Couves',
      email: 'ze@couves.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Zé das Couves');
    expect(profile.email).toBe('ze@couves.com');
  });

  it('should not be able to show profile from non-existing user', async () => {
    expect(
      showProfile.execute({
        user_id: 'sujeito-nao-existente.',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
