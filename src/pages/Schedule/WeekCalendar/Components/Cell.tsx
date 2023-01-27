import { Box, Button, Divider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Appointment } from '../../types';
import {
  format, setMinutes, setSeconds, isBefore, differenceInMinutes, addHours, isSameHour, isFuture
} from 'date-fns';
import { days } from '../constants';
import AppointmentForm, { AppointmentFormType } from '../../AppointmentForm';
import { AppointmentCard } from './AppointmentCard';
import { HorizontalLine } from './HorizontalLine';
import { useRef, useState } from 'react';
import { useConfig } from '../../../../context/ConfigProvider/useConfig';


export const Cell = ({ row, appointments, day }: { row: any, appointments: Appointment[], day: typeof days[0] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
  const { inativeDays } = useConfig()

  const isInativeDay = inativeDays.includes(new Date(row[day.key]).getDay());

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

  return (
    <Box
      w="100%"
      h="100%"
      minW={"4px"}
      minH={"6vh"}
      bg={isInativeDay ? "#f1f1f1" : "white"}
      borderLeft={"1px solid"}
      borderTop={"1px solid"}
      borderColor={"#c1c1c1"}
      position={"relative"}
    >
      {!isInativeDay && <>
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
        initialFocusRef={initialRef}
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