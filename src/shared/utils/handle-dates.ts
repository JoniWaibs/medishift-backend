import { format } from 'date-fns';
import { envs } from '../../config/envs';
import { fromZonedTime } from 'date-fns-tz';

interface HandleTimeProps {
  date: Date;
  startTime: string;
  endTime: string;
}

export class HandleDates {
  static newDate(): string {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  }
  static dateNow(): string {
    return format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss");
  }

  // TODO: scheduleRecurringShift()
  static scheduleSingleShift({ date, startTime, endTime }: HandleTimeProps) {
    const startDateTimeStr = `${date} ${startTime}`;
    const endDateTimeStr = `${date} ${endTime}`;

    return {
      // Convert the provided date and times into Argentina's timezone
      start: fromZonedTime(startDateTimeStr, envs.TIMEZONE),
      end: fromZonedTime(endDateTimeStr, envs.TIMEZONE)
    };
  }
}
