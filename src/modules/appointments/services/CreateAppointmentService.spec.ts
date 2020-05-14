import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 12).getTime(); // 12h
    });

    const appointment = await createAppointment.execute({
      provider_id: '1233123123',
      user_id: 'user',
      date: new Date(2020, 4, 20, 13), // 13h. horário válido. Mais tarde que a hora do mock
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1233123123');
  });

  it('should not be able to create two appointments on the same date/time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 12).getTime();
    });
    const appointmentDate = new Date(Date.now());

    await createAppointment.execute({
      provider_id: '1233123123',
      user_id: 'user',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: '1233123123',
        user_id: 'user',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment on past date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 12).getTime(); // 12h
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 9), // 9h - horário inválido. Mais cedo que a hora do mock
        provider_id: '1233123123', // ou seja, agendamento criado numa hora do passado
        user_id: 'user',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment when user and provider are the same person', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 12).getTime(); // 12h
    });
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 13), // 13h - horário válido
        provider_id: 'same-123', // mesmo id de user e provider
        user_id: 'same-123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment before 8h and after 17h', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 12).getTime(); // 12h
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 7), // 7h
        provider_id: '1233123123',
        user_id: 'user',
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 19), // 19h
        provider_id: '1233123123',
        user_id: 'user',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
