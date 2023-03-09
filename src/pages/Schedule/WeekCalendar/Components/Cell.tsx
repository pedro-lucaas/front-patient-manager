import { Box, Button, Divider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Text } from '@chakra-ui/react';
import {
  format, setMinutes, setSeconds, isBefore, differenceInMinutes, addHours, isSameHour, isFuture, startOfDay, addMinutes
} from 'date-fns';
import { days } from '../constants';
import AppointmentForm from '../../AppointmentForm';
import { AppointmentCard } from './AppointmentCard';
import { HorizontalLine } from './HorizontalLine';
import { useState } from 'react';
import { useAuth } from '../../../../context/AuthProvider/useAuth';
import { Appointment, AppointmentFormType } from '../../../../services/api/appointments/types';
import { WeekCalendarTable } from '../types';

export const Cell = ({ row, appointments, day }: { row: WeekCalendarTable, appointments: Appointment[], day: typeof days[0] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { user } = useAuth()
  const lunchTime = user?.lunchTime || [0, 0]
  const inactiveDays = user?.inactiveDays || [];
  const isInativeDay = !!inactiveDays && inactiveDays.includes(day.key) || false;
  const isLunchTime = !!lunchTime && isSameHour(addMinutes(startOfDay(row[day.key]), lunchTime[0]), new Date(row[day.key])) || false

  const formInitialValues: AppointmentFormType = {
    date: setMinutes(setSeconds(row[day.key], 0), 0),
    initTime: `${format(setMinutes(setSeconds(row[day.key], 0), 0), "HH:mm")}`,
    endTime: `${format(addHours(setMinutes(setSeconds(row[day.key], 0), 0), 1), "HH:mm")}`,
    price: 0,
    procedure: "",
    patientId: "",
  }

  const [formValues, setFormValues] = useState<AppointmentFormType>(formInitialValues);

  let hasAppointment = true;
  for (const event of appointments) {
    if (isSameHour(event.initDate, row[day.key])) {
      hasAppointment = false;
      break;
    }
  }

  if (!user) return <></>

  return (
    <Box
      w="100%"
      h="100%"
      minW={"4px"}
      minH={"6vh"}
      bg={isInativeDay ? "#d1d1d1" : "white"}
      opacity={isInativeDay ? 0.5 : 1}
      borderLeft={"1px solid"}
      borderTop={"1px solid"}
      borderColor={"#c1c1c1"}
      position={"relative"}
      fontSize={"0.6em"}
    >
      {isInativeDay ? <>Dia Indisponível</> : isLunchTime && lunchTime ?
        <Box
          bg={"#e1e1e1"}
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          height={`${(lunchTime[1] / 60 + lunchTime[1] - lunchTime[0]) / 60 * 100}%`}
          zIndex={2}
        >
          <Text opacity={0.5}>
            Almoço <br />
            {format(addMinutes(startOfDay(row[day.key]), lunchTime[0]), "HH:mm")} - {format(addMinutes(startOfDay(row[day.key]), lunchTime[1]), "HH:mm")}
          </Text>
        </Box>
        : <>
          {appointments.map((appointment, index) => {
            if (
              isSameHour(appointment.initDate, row[day.key])) {
              return (
                <Box key={index}>
                  <AppointmentCard appointment={appointment} onEdit={(formValues: AppointmentFormType) => {
                    setFormValues(formValues);
                    onOpen();
                  }} />
                </Box>
              );
            }
          })}
          {isBefore(row[day.key], new Date()) && differenceInMinutes(new Date(), row[day.key]) < 60 && (
            <HorizontalLine date={new Date()} />
          )}

          {hasAppointment && isFuture(row[day.key]) && (
            <Button
              position={"absolute"}
              top={0}
              right={0}
              padding={"0px"}
              size={"xs"}
              variant={"outline"}
              borderRadius={"3px"}
              colorScheme={"cyan"}
              onClick={() => {
                setFormValues(formInitialValues);
                onOpen();
              }}
            >
              +
            </Button>
          )}
        </>
      }
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"sm"} fontWeight={"400"}>{formValues.appointmentId ? "Editar Agendamento" : "Novo Agendamento"} </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody pb={6}>
            <AppointmentForm values={formValues} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

    </Box>

  );
}
