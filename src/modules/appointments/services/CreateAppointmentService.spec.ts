import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: '1233123123',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1233123123');
  });

  it('should not be able to create two appointments on the same date/time', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      provider_id: '1233123123',
      date: appointmentDate,
    });

    expect(
      createAppointment.execute({
        provider_id: '1233123123',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
