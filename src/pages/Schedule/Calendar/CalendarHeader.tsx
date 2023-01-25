import { DaysOfWeek } from "./constants";

const CalendarHeader = () => {
  return (
    <thead>
      <tr className="text-center h-20">
        {DaysOfWeek.map((day, index) => {
          return <th className="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs" key={index}>
            <span className="xl:block lg:block md:block sm:block hidden">{day.name}</span>
            <span className="xl:hidden lg:hidden md:hidden sm:hidden block">{day.short}</span>
          </th>
        })}
      </tr>
    </thead>
  )
}

export default CalendarHeader;