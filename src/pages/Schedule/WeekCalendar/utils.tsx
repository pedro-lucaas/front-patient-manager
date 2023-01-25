import { TableColumn } from "react-data-table-component";
import { Appointment, } from "../types";
import { WeekCalendarTable } from "./types";
import { setHours, setMinutes, setSeconds, isBefore, addMinutes, addDays, format } from "date-fns";
import { HeadRow, Cell } from "./TableComponents";
import { days } from "./constants";

export function makeColumns(appointments: Appointment[], week: WeekCalendarTable): TableColumn<WeekCalendarTable>[] {
  const columns: TableColumn<WeekCalendarTable>[] = [
    {
      name: "",
      cell: (row) => <HeadRow row={row} />,
      minWidth: "60px",
      style: {
        width: "auto",
        margin: "0",
      }
    },
  ];
  for (const day of days) {
    columns.push({
      name: <div className="w-full justify-center text-center">
        <div>{day.name}</div>
        <div>{format(week[day.key], "dd/MM/yyyy")}</div>
      </div>,
      cell: (row) => <Cell row={row} appointments={appointments} day={day} />,
      style: {
        margin: "0",
      },
      grow: 3,
      minWidth: "6vw",
    });
  }
  return columns;
}

export function makeData(dayDateTime: Date): WeekCalendarTable[] {
  const data = [];
  const step = 60;
  const start = 8;
  const end = 18;
  const startDateTime = addDays(setHours(setMinutes(setSeconds(dayDateTime, 0), 0), start), - dayDateTime.getDay());
  const endDateTime = setHours(startDateTime, end);
  let iterator = startDateTime;
  while (isBefore(iterator, endDateTime)) {
    const row: WeekCalendarTable = {
      sunday: iterator,
      monday: addDays(iterator, 1),
      tuesday: addDays(iterator, 2),
      wednesday: addDays(iterator, 3),
      thursday: addDays(iterator, 4),
      friday: addDays(iterator, 5),
      saturday: addDays(iterator, 6),
    }
    data.push(row);
    iterator = addMinutes(iterator, step);
  }
  return data;
}