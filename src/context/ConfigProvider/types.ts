import { DayOfWeek } from "../../pages/Schedule/WeekCalendar/types";

export interface IAttribute {
  name: string;
  tag: string;
}


export interface IConfigContext {
  attributes: IAttribute[] | null | undefined;
  inativeDays: InativeDays;
  setInativeDays: React.Dispatch<React.SetStateAction<InativeDays>>;
  lunchTime: intervalInt | undefined;
  setLunchTime: React.Dispatch<React.SetStateAction<intervalInt | undefined>>;
  workingTime: intervalInt;
  setWorkingTime: React.Dispatch<React.SetStateAction<intervalInt>>;
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

export type InativeDays = {
  [key in DayOfWeek]: boolean;
};