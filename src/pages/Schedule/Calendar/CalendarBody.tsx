import { setHours, setMinutes, isBefore } from "date-fns"
import CalendarItem from "./CalendarItem";

const CalendarBody = ({ month, year }: { month: number, year: number }) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfMonthIndex = firstDayOfMonth.getDay();
  const fistDay = new Date(year, month, -firstDayOfMonthIndex + 1)
  const lastDay = new Date(year, month + 1, 7 - lastDayOfMonth.getDay())

  let Days: Date[] = [];
  let day = fistDay;
  while (isBefore(day, lastDay)) {
    Days.push(day);
    day = setHours(setMinutes(day, day.getMinutes() + 1440), day.getHours());
  }

  return (
    <tbody>
      {Days.map((day, index) => {
        if (index % 7 === 0) {
          return <tr className="text-center h-20" key={index}>
            {Days.slice(index, index + 7).map((day, index) => {
              return <CalendarItem date={day} month={month} key={index} />
            })
            }
          </tr>
        }
      })}
    </tbody>
  )
}

export default CalendarBody;