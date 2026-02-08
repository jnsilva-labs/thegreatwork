import { DateTime, IANAZone } from "luxon";

interface ConvertLocalBirthInput {
  birthDate: string;
  birthTime?: string;
  timeUnknown: boolean;
  timezone: string;
}

export interface UtcConversionResult {
  datetimeUtc: string;
  assumedNoon: boolean;
  localTimeUsed: string;
}

const pad2 = (value: number): string => String(value).padStart(2, "0");

export const isValidIanaTimezone = (timezone: string): boolean => {
  return IANAZone.isValidZone(timezone);
};

export const convertBirthLocalToUtc = ({
  birthDate,
  birthTime,
  timeUnknown,
  timezone
}: ConvertLocalBirthInput): UtcConversionResult => {
  if (!isValidIanaTimezone(timezone)) {
    throw new Error("Invalid timezone");
  }

  const [yearRaw, monthRaw, dayRaw] = birthDate.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new Error("Invalid birthDate");
  }

  const timeToUse = timeUnknown ? "12:00" : birthTime;
  if (!timeToUse) {
    throw new Error("birthTime is required when timeUnknown is false");
  }

  const [hourRaw, minuteRaw] = timeToUse.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new Error("Invalid birthTime");
  }

  const local = DateTime.fromObject(
    {
      year,
      month,
      day,
      hour,
      minute,
      second: 0,
      millisecond: 0
    },
    { zone: timezone }
  );

  if (!local.isValid) {
    throw new Error(local.invalidExplanation ?? "Invalid local birth date/time");
  }

  const utc = local.toUTC();
  const datetimeUtc = `${utc.toFormat("yyyy-LL-dd'T'HH:mm:ss")}Z`;

  return {
    datetimeUtc,
    assumedNoon: timeUnknown,
    localTimeUsed: `${pad2(hour)}:${pad2(minute)}`
  };
};
