import React, { useState } from 'react';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { Button } from "@chakra-ui/react";
import { Months } from "./constants";
import CalendarHeader from './CalendarHeader';
import CalendarBody from './CalendarBody';

const Calendar = () => {
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  });

  const handleNextMonth = () => {
    if (date.month === 11) {
      setDate({
        year: date.year + 1,
        month: 0
      })
    } else {
      setDate({
        year: date.year,
        month: date.month + 1
      })
    }
  }

  const handlePreviousMonth = () => {
    if (date.month === 0) {
      setDate({
        year: date.year - 1,
        month: 11
      })
    } else {
      setDate({
        year: date.year,
        month: date.month - 1
      })
    }
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="wrapper bg-white rounded shadow w-full ">
        <div className="header flex justify-between border-b p-2">
          <span className="text-lg font-bold">
            {date.year} {Months[date.month]}
          </span>
          <div className="buttons">
            <button onClick={handlePreviousMonth} className="px-5 py-2">
              <BsArrowLeftCircle />
            </button>
            <button onClick={handleNextMonth} className="px-5 py-2">
              <BsArrowRightCircle />
            </button>
          </div>
        </div>
        <table className="w-full">
          <CalendarHeader />
          <CalendarBody month={date.month} year={date.year} />
        </table>
      </div>
    </div >
  );;
}

export default Calendar;