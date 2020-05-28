import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CachePrrovider/models/ICacheProvider';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

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

    return appointments;
  }
}
export default ShowAllAppointmentsService;
