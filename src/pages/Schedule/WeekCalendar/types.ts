
export type DayOfWeek = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export type WeekCalendarTable = {
  [key in DayOfWeek]: Date;
};


export type day = {
  name: string;
  key: DayOfWeek
};