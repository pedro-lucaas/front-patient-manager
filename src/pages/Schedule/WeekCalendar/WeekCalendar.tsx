import { useState } from "react";

import { Flex, Spinner, VStack } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import DataTable, { createTheme } from "react-data-table-component";
import { APPOINTMENT_QUERY_KEY, listAppointmentsByInterval } from "../service";
import { AppointmentRaw } from "../types";
import { makeColumns, makeData } from "./utils";
import { setMinutes, setSeconds, setHours, addDays } from "date-fns";
import { Pagination } from "../../../helpers/Pagination";

createTheme('weekCalendar', {
  divider: {
    default: 'transparent',
  },
}, 'light');

const WeekCalendar = () => {
  const [day, setDay] = useState(new Date());

  const data = makeData(day)
  const interval = { initDate: data[0].sunday.toISOString(), endDate: data[data.length - 1].saturday.toISOString() }

  const { data: appointmentsRaw, isLoading } = useQuery<Pagination<AppointmentRaw>, Error>([APPOINTMENT_QUERY_KEY],
    () => listAppointmentsByInterval(interval));

  const appointments = appointmentsRaw?.items.map((appointment) => {
    return {
      ...appointment,
      initDate: new Date(appointment.initDate),
      endDate: new Date(appointment.endDate),
    };
  });

  const columns = makeColumns(appointments ?? [], data[0]);

  if (!data) return <Spinner />
  return (
    <div className="w-full mt-10">
      <div className="wrapper w-full bg-white px-6 py-4 rounded shadow-md ring-1 ring-gray-900/10">
        <Flex justifyContent="center" alignItems="center" mb={4}>
          <button
            className="border border-gray-500 border-r-0 font-medium text-xs py-2 px-4 rounded-l-lg"
            onClick={() => setDay(addDays(setHours(setMinutes(setSeconds(day, 0), 0), 0), -7))}
          >
            Prev Week
          </button>
          <div
            className="border border-gray-500 font-medium text-xs py-2 px-4"
          >
            {data[0].sunday.toLocaleDateString()} - {data[data.length - 1].saturday.toLocaleDateString()}
          </div>
          <button
            className="border border-gray-500 border-l-0 font-medium text-xs py-2 px-4 rounded-r"
            onClick={() => setDay(addDays(setHours(setMinutes(setSeconds(day, 0), 0), 0), 7))}
          >
            Next Week
          </button>
        </Flex>
        <DataTable
          theme="weekCalendar"
          columns={columns}
          data={data}
          progressPending={isLoading}
          progressComponent={<Spinner />}
          customStyles={{
            cells: {
              style: {
                margin: "1px",
                padding: "0 1px",
              },
            },
            headCells: {
              style: {
                margin: "1px",
                padding: "0 0px",
              },
            },
          }
          }
        />
      </div>
    </div >
  );;
}

export default WeekCalendar;