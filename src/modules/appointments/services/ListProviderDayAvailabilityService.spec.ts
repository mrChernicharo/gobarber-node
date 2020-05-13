// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to list a provider's month availability", async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 10, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 10, 16, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 10,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: true },
        { hour: 16, available: false },
        { hour: 17, available: true },
      ])
    );
  });
});
