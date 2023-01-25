


export type WeekCalendarTable = {
  sunday: Date;
  monday: Date;
  tuesday: Date;
  wednesday: Date;
  thursday: Date;
  friday: Date;
  saturday: Date;
};

type WeekCalendarTableKeys = PropertyKey & keyof WeekCalendarTable;

export type day = {
  name: string;
  key: WeekCalendarTableKeys
};