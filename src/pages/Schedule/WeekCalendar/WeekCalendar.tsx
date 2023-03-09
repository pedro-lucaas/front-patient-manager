import { useState } from "react";
import { Box, Flex, Icon, Spinner } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import DataTable, { createTheme } from "react-data-table-component";
import { makeColumns, makeData } from "./utils";
import { setMinutes, setSeconds, setHours, addDays, format, addMonths } from "date-fns";
import { Pagination } from "../../../helpers/Pagination";
import DatePicker from "react-datepicker";
import { BiCalendar } from "react-icons/bi";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { APPOINTMENT_QUERY_KEY, listAppointments } from "../../../services/api/appointments";
import { Appointment, AppointmentStatusEnum } from "../../../services/api/appointments/types";


createTheme('weekCalendar', {
  divider: {
    default: 'transparent',
  },
}, 'light');

const WeekCalendar = () => {
  const [day, setDay] = useState(new Date());

  const data = makeData(day)
  const interval = { initDate: data[0][0].toISOString(), endDate: data[data.length - 1][6].toISOString() }

  const { data: appointments, isLoading } = useQuery<Pagination<Appointment>, Error>([APPOINTMENT_QUERY_KEY, { interval }],
    () => listAppointments(interval));

  const columns = makeColumns(appointments?.items ?? [], data[0]);

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
                {format(data[0][0], "dd/MM/yyyy")} - {format(data[data.length - 1][6], "dd/MM/yyyy")}
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
        <Flex w={"full"} justifyContent={"center"} alignItems={"center"} gap={"10px"}>
          <Box fontSize={"0.7em"} color={"linkedin.500"} textDecoration={"underline"} cursor={"pointer"} onClick={() => setDay(new Date())}>Hoje</Box>
          <Box fontSize={"0.7em"} color={"linkedin.500"} textDecoration={"underline"} cursor={"pointer"} onClick={() => setDay(addDays(new Date(), 15))}>15 dias</Box>
          <Box fontSize={"0.7em"} color={"linkedin.500"} textDecoration={"underline"} cursor={"pointer"} onClick={() => setDay(addMonths(new Date(), 1))}>1 meses</Box>
          <Box fontSize={"0.7em"} color={"linkedin.500"} textDecoration={"underline"} cursor={"pointer"} onClick={() => setDay(addMonths(new Date(), 3))}>3 meses</Box>
          <Box fontSize={"0.7em"} color={"linkedin.500"} textDecoration={"underline"} cursor={"pointer"} onClick={() => setDay(addMonths(new Date(), 6))}>6 meses</Box>
        </Flex>
        <Flex w={"full"} maxW={"980px"} position="relative">
          {isLoading &&
            <Flex
              zIndex={30}
              position={"absolute"}
              top={0}
              left={0}
              w={"full"}
              h={"full"}
              maxH={"80vh"}
              justifyContent={"center"}
              alignItems={"center"}
              bg={"#cccccc66"}
            >
              <Spinner />
            </Flex>
          }
          <DataTable
            theme="weekCalendar"
            columns={columns}
            data={data}
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