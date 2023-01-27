import { TableColumn } from "react-data-table-component";
import { Appointment, } from "../types";
import { WeekCalendarTable } from "./types";
import { setHours, setMinutes, setSeconds, isBefore, addMinutes, addDays, format } from "date-fns";
import { days } from "./constants";
import { Cell } from "./Components/Cell";
import { HeadRow } from "./Components/HeadRow";
import { useConfig } from "../../../context/ConfigProvider/useConfig";

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
      conditionalCellStyles: [
        {
          when: (row) => {
            const date = row[day.key].getDay();
            return date === 6;
          },
          style: {
            borderRight: "1px solid #c1c1c1",
          }
        },
      ],
      grow: 9,
      minWidth: "none",
    });
  }
  return columns;
}

export function makeData(dayDateTime: Date): WeekCalendarTable[] {
  const { workingTime } = useConfig()
  const data = [];
  const step = 60;
  const start = workingTime.start;
  const end = workingTime.end;
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