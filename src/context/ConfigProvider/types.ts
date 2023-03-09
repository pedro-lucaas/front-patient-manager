import { DayOfWeek } from "../../pages/Schedule/WeekCalendar/types";

export interface IAttribute {
  name: string;
  value: string;
}


export interface IConfigContext {
  attributes: IAttribute[] | null | undefined;
  createAttribute: (name: string, tag: string) => Promise<void>;
  deleteAttribute: (name: string) => Promise<void>;
}

export interface IConfigProvider {
  children: JSX.Element;
}
export type intervalInt = {
  start: number;
  end: number;
};

export type InactiveDays = {
  [key in DayOfWeek]: boolean;
};