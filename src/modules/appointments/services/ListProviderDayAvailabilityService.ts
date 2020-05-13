import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        month,
        year,
        day,
      }
    );
    const startHour = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour
    );

    const availability = eachHourArray.map(hour => {
      const hourHasAppointment = appointments.find(
        appointment => getHours(appointment.date) === hour
      );
      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hourHasAppointment && isAfter(compareDate, currentDate),
      };
    });
    return availability;
  }
}

export default ListProviderDayAvailabilityService;
