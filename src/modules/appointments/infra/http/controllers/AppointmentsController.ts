import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ShowAllAppointmentsService from '@modules/appointments/services/ShowAllAppointmentsService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      provider_id,
      user_id,
      date,
    });

    return response.json(appointment);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const allAppointments = container.resolve(ShowAllAppointmentsService);

    const appointments = await allAppointments.execute();

    const total = appointments.length;

    return response.json({ total, appointments });
  }
}
