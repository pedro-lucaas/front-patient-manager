import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import { Appointment } from '../types';
import { format, setMinutes, setSeconds, isBefore, isEqual, differenceInMinutes, addHours, isSameHour, isFuture } from "date-fns";
import { days } from './constants';
import { useRef } from 'react';
import AppointmentForm, { AppointmentFormType } from '../AppointmentForm';

export const HeadRow = ({ row }: { row: any }) => {
  return (
    <Box
      w="100%"
      h="100%"
      bg="transparent"
      borderLeft={"1px solid #e2e8f0"}
      position={"relative"}
    >
      <Text fontSize={"0.9em"} position={"absolute"} right={0} top={0} transform={"translate(0,-50%)"}>
        {format(row.sunday, "HH:mm")}
      </Text>
    </Box>
  );
}

export const Cell = ({ row, appointments, day }: { row: any, appointments: Appointment[], day: typeof days[0] }) => {

  const formInitialValues: AppointmentFormType = {
    date: setMinutes(setSeconds(row[day.key], 0), 0),
    initTime: `${format(setMinutes(setSeconds(row[day.key], 0), 0), "HH:mm")}`,
    endTime: `${format(addHours(setMinutes(setSeconds(row[day.key], 0), 0), 1), "HH:mm")}`,
    price: 0,
    procedure: "",
    patientId: "",
  }

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
      minW={"70px"}
      minH={"7vh"}
      bg="transparent"
      borderLeft={"1px solid"}
      borderTop={"1px solid"}
      borderColor={"#c1c1c1"}
      position={"relative"}
    >
      {appointments.map((appointment, index) => {
        if (
          isSameHour(appointment.initDate, row[day.key])) {
          return (
            <Box key={index}>
              <AppointmentCard appointment={appointment} />
            </Box>
          );
        }
      })}
      {isBefore(row[day.key], new Date()) && differenceInMinutes(new Date(), row[day.key]) < 60 && (
        <HorizontalLine date={new Date()} />
      )}

      {hasAppointment && isFuture(row[day.key]) && (
        <NewAppointment formInitialValues={formInitialValues} />
      )}
    </Box>

  );
}

const HorizontalLine = ({ date }: { date: Date }) => {
  return (
    <Box
      position={"absolute"}
      top={`${date.getMinutes() * 100 / 60}%`}
      left={0}
      right={"-5px"}
      height={"2px"}
      zIndex={2}
    >
      <Box position={"relative"} w={"100%"} h={"100%"} bg={"#e53e3e"}>
        <Box position={"absolute"} top={"-5px"} left={"-5px"} w={"10px"} h={"10px"} bg={"#e53e3e"} zIndex={2} borderRadius={"5px"} />
      </Box>
    </Box>
  );
}

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  return (
    <Box
      position={"absolute"}
      top={`${appointment.initDate.getMinutes() * 100 / 60}%`}
      left={0}
      right={0}
      height={`${((appointment.endDate.getHours() - appointment.initDate.getHours()) * 60 + appointment.endDate.getMinutes() - appointment.initDate.getMinutes()) / 60 * 100}%`}
      bg={appointment.patient.sex === "M" ? "#3182ce" : "#e55fae"}
      color={"white"}
      padding={"5px"}
      zIndex={1}
      fontSize={"0.8em"}
    >
      {`${format(appointment.initDate, "HH:mm")} - ${format(appointment.endDate, "HH:mm")}`}
      <Text fontWeight={"bold"}>{appointment.patient.name}</Text>
    </Box>
  );
}

const NewAppointment = ({ formInitialValues }: { formInitialValues: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)

  return <>
    <Button
      position={"absolute"}
      top={0}
      right={0}
      padding={"0px"}
      size={"xs"}
      variant={"outline"}
      borderRadius={"3px"}
      colorScheme={"cyan"}
      onClick={onOpen}
    >
      +
    </Button>
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar Agendamento</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <AppointmentForm values={formInitialValues} />
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
}
