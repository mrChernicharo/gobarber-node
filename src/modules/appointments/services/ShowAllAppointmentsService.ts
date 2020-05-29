import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CachePrrovider/models/ICacheProvider';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { classToClass } from 'class-transformer';

@injectable()
class ShowAllAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute(): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.showAll();

    return classToClass(appointments);
  }
}
export default ShowAllAppointmentsService;
