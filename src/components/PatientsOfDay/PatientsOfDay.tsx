import { Flex, Text, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { setMinutes, setSeconds, setHours, addDays } from "date-fns";
import PatientBox from './PatientBox';
import { APPOINTMENT_QUERY_KEY, listAppointments } from '../../services/api/appointments';

const PatientsOfDay: React.FC = () => {
  const [isLargerThan820] = useMediaQuery("(min-width: 820px)");

  const interval = {
    initDate: setHours(setMinutes(setSeconds(new Date(), 0), 0), 0).toISOString(),
    endDate: setHours(setMinutes(setSeconds(addDays(new Date(), 1), 0), 0), 0).toISOString()
  }

  const { data: appointments, isLoading } = useQuery([APPOINTMENT_QUERY_KEY, 'today'], () => listAppointments(interval));

  if (isLoading) return <div>Carregando...</div>

  return (
    <Flex className="bg-white shadow-md ring-1 ring-gray-900/10 pb-4" minW={"200px"} maxW={isLargerThan820 ? "350px" : "none"} w="full" h="full" direction="column">
      <Flex minH={"70px"} alignItems={"center"} className={"px-4 border-y border-gray-900/10"}>
        <Text className="w-full text-xl text-gray-900">Pacientes do dia</Text>
      </Flex>
      {appointments && appointments.items.map((appointment) => {
        return <div key={appointment.id}>
          <PatientBox appointment={appointment} />
        </div>
      })}
    </Flex>
  );
}

export default PatientsOfDay;