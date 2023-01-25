const CalendarItem = ({ date, month }: { date: Date, month: number }) => {
  const label = date.getDate();
  const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
  const isCurrentMonth = date.getMonth() === month;

  return (
    <td className={`border ${isCurrentMonth ? isToday ? "bg-purple-400" : "bg-yellow-200" : "bg-white-100"} p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300`}>
      <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
        <div className="center h-5 w-full">
          <span className={`${isToday ? "text-white" : "text-gray-500"}`}>
            {label}
          </span>
        </div>
        <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
      </div>
    </td>
  )
}

export default CalendarItem;