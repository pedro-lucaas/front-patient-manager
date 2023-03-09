import { TableColumn } from "react-data-table-component";
import { WeekCalendarTable } from "./types";
import { setHours, setMinutes, setSeconds, isBefore, addMinutes, addDays, format } from "date-fns";
import { days } from "./constants";
import { Cell } from "./Components/Cell";
import { HeadRow } from "./Components/HeadRow";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { Appointment } from "../../../services/api/appointments/types";

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
          when: () => {
            return day === days[days.length - 1];
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
  const { user } = useAuth()
  const workTime = user?.workTime || [8, 18];
  const data = [];
  const step = 60;
  const start = workTime[0];
  const end = workTime[1];
  const startDateTime = addDays(setHours(setMinutes(setSeconds(dayDateTime, 0), 0), start), - dayDateTime.getDay());
  const endDateTime = setHours(startDateTime, end);
  let iterator = startDateTime;
  while (isBefore(iterator, endDateTime)) {
    const row: WeekCalendarTable = {
      0: iterator,
      1: addDays(iterator, 1),
      2: addDays(iterator, 2),
      3: addDays(iterator, 3),
      4: addDays(iterator, 4),
      5: addDays(iterator, 5),
      6: addDays(iterator, 6),
    }
    data.push(row);
    iterator = addMinutes(iterator, step);
  }
  return data;
}