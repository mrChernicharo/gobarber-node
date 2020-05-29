import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CachePrrovider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cachedKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    // console.log(cachedKey);

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cachedKey
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          day,
          month,
          year,
        }
      );
      await this.cacheProvider.save(cachedKey, classToClass(appointments));
    }

    console.log(appointments);

    return appointments;
  }
}

export default ListProviderAppointmentsService;
