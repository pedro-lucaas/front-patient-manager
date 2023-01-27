import { useState } from "react";

import { Box, Flex, Icon, Spinner } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import DataTable, { createTheme } from "react-data-table-component";
import { APPOINTMENT_QUERY_KEY, listAppointments } from "../service";
import { AppointmentRaw, AppointmentStatusEnum } from "../types";
import { makeColumns, makeData } from "./utils";
import { setMinutes, setSeconds, setHours, addDays, format } from "date-fns";
import { Pagination } from "../../../helpers/Pagination";
import DatePicker from "react-datepicker";
import { BiCalendar } from "react-icons/bi";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";


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
    () => listAppointments(interval));

  const appointments = appointmentsRaw?.items.map((appointment) => {
    return {
      ...appointment,
      initDate: new Date(appointment.initDate),
      endDate: new Date(appointment.endDate),
      status: AppointmentStatusEnum[appointment.status as keyof typeof AppointmentStatusEnum],
      patient: {
        ...appointment.patient,
        birthDate: new Date(appointment.patient.birthDate)
      }
    };
  });

  const columns = makeColumns(appointments ?? [], data[0]);

  if (!data) return <Spinner />
  return (
    <div className="w-full mt-10">
      <Flex alignItems={"center"} flexDir={"column"} className="wrapper w-full bg-white px-6 py-4 rounded shadow-md ring-1 ring-gray-900/10">
        <Flex justifyContent="center" alignItems="stretch" mb={4}>
          <button
            className="border border-gray-500 border-r-0 font-medium text-xs py-2 px-4 rounded-l"
            onClick={() => setDay(addDays(setHours(setMinutes(setSeconds(day, 0), 0), 0), -7))}
          >
            <Icon as={IoMdArrowDropleft} boxSize={"15px"} mb={"1px"} />
          </button>
          <div className="z-10">
            <DatePicker selected={day} onChange={(date: Date) => setDay(date)} customInput={
              <Box as="button" className="border border-gray-500 font-medium text-xs py-2 px-4">
                {format(data[0].sunday, "dd/MM/yyyy")} - {format(data[data.length - 1].saturday, "dd/MM/yyyy")}
                <Icon as={BiCalendar} ml={2} boxSize={"15px"} mb={"1px"} />
              </Box>
            } />
          </div>
          <button
            className="border border-gray-500 border-l-0 font-medium text-xs py-2 px-4 rounded-r"
            onClick={() => setDay(addDays(setHours(setMinutes(setSeconds(day, 0), 0), 0), 7))}
          >
            <Icon as={IoMdArrowDropright} boxSize={"15px"} mb={"1px"} />
          </button>
        </Flex>
        <Flex w={"full"} maxW={"980px"}>
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
        </Flex>
      </Flex>
    </div >
  );;
}

export default WeekCalendar;