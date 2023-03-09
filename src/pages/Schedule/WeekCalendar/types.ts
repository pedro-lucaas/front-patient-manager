
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeekCalendarTable = {
  [key in DayOfWeek]: Date;
};


export type day = {
  name: string;
  key: DayOfWeek
};