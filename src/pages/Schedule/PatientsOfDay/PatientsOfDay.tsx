import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { Pagination } from '../../../helpers/Pagination';
import { APPOINTMENT_QUERY_KEY, listAppointments } from '../service';
import { AppointmentRaw, AppointmentStatusEnum } from '../types';
import { setMinutes, setSeconds, setHours, addDays } from "date-fns";
import PatientBox from './PatientBox';

export const PatientsOfDay: React.FC = () => {
  const interval = {
    initDate: setHours(setMinutes(setSeconds(new Date(), 0), 0), 0).toISOString(),
    endDate: setHours(setMinutes(setSeconds(addDays(new Date(), 1), 0), 0), 0).toISOString()
  }

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

  if (isLoading) return <div>Carregando...</div>

  return <>
    <Flex minH={"70px"} alignItems={"center"} className={"px-4 border-y border-gray-900/10"}>
      <Text className="w-full text-xl text-gray-900">Pacientes do dia</Text>
    </Flex>
    {appointments && appointments.map((appointment) => {
      return <div key={appointment.id}>
        <PatientBox appointment={appointment} />
      </div>
    })
    }
  </>;
}