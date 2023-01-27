import { Box, Button, Divider, Flex, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import { Appointment } from '../../types';
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  setYear,
  isToday
} from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { AppointmentFormType } from '../../AppointmentForm';
import { useNavigate } from 'react-router';
import routes from '../../../../routes/routes';
import { APPOINTMENT_QUERY_KEY, updateAppointmentFn } from '../../service';
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';
import { numericFormatter } from 'react-number-format'
import { FaCheckCircle } from 'react-icons/fa';

export const AppointmentCard = ({ appointment, onEdit }: { appointment: Appointment, onEdit: (formValues: AppointmentFormType) => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const markAsPaid = async () => {
    try {
      await updateAppointmentFn({
        appointmentId: appointment.id,
        paid: true,
      })
      toast.success("Pagamento marcado como pago com sucesso!");
      queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY);
    } catch (error) {
      toast.error("Ocorreu um erro ao marcar pagamento como pago!");
    }
  }
  const unmarkAsPaid = async () => {
    try {
      await updateAppointmentFn({
        appointmentId: appointment.id,
        paid: false,
      })
      toast.success("Pagamento desmarcado como pago com sucesso!");
      queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY);
    } catch (error) {
      toast.error("Ocorreu um erro ao desmarcar pagamento como pago!");
    }
  }

  let appointmentTimeFormated = `${format(appointment.initDate, "PPPP", { locale: pt })} - ${format(appointment.initDate, "HH:mm")} às ${format(appointment.endDate, "HH:mm")}`;
  appointmentTimeFormated = appointmentTimeFormated.charAt(0).toUpperCase() + appointmentTimeFormated.slice(1);

  return (
    <>
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
        overflow={"hidden"}
        boxShadow={"inset 0px 0px 3px 1px rgba(0,0,0,0.3)"}
        cursor={"pointer"}
        onClick={onOpen}
      >
        {`${format(appointment.initDate, "HH:mm")} - ${format(appointment.endDate, "HH:mm")}`}
        <Text fontWeight={"bold"}>{appointment.patient.name}</Text>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent h={"80vh"}>
          <ModalHeader fontSize={"sm"} fontWeight={"400"}>Detalhes do agendamento</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody pb={6} h={"100%"} display={"flex"} flexDir={"column"} justifyContent={"space-between"}>
            <Box w={"100%"} display={"flex"} flexDir={"column"} alignItems={"center"}>
              <Text textTransform={"uppercase"} fontWeight={"300"} fontSize={"2xl"}>{appointment.patient.name}</Text>
              <Text fontSize={"sm"}>
                {`Sexo ${appointment.patient.sex === "M" ? "Masculino" : "Feminino"}`}
              </Text>
              <Text fontSize={"sm"}>
                {`${differenceInYears(new Date(), appointment.patient.birthDate)} anos,
              ${differenceInMonths(new Date(), appointment.patient.birthDate) % 12} meses,
              ${differenceInDays(new Date(), setYear(appointment.patient.birthDate, new Date().getFullYear()))} dias`}
              </Text>
              <Text fontSize={"sm"}>
                {`${appointment.patient.phone}`}
              </Text>
            </Box>
            <Box>
              <Text>{appointmentTimeFormated}</Text>
            </Box>
            <Box>
              <Text textTransform={"capitalize"}>Procedimento: {appointment.procedure}</Text>
              <Flex alignItems={"end"}>
                <Text>{numericFormatter(appointment.price.toFixed(2), {
                  prefix: "R$ ",
                  decimalScale: 2,
                  decimalSeparator: ",",
                  thousandSeparator: ".",
                })}</Text>
                {appointment.paid && <>
                  <Text ml={"auto"}>Pago</Text>
                  <Icon color={"green.500"} as={FaCheckCircle} ml={"5px"} mb={"3px"} />
                </>
                }
              </Flex>
            </Box>
            <Box>
              {!appointment.paid && <Button variant={"outline"} w={"full"} onClick={markAsPaid}>Marcar como pago</Button>}
              {appointment.paid && <Button variant={"outline"} w={"full"} onClick={unmarkAsPaid}>Desmarcar como pago</Button>}
              <Button variant={"outline"} w={"full"} onClick={() => {
                onEdit({
                  appointmentId: appointment.id,
                  patientId: appointment.patient.id,
                  date: appointment.initDate,
                  initTime: format(appointment.initDate, "HH:mm"),
                  endTime: format(appointment.endDate, "HH:mm"),
                  procedure: appointment.procedure,
                  price: appointment.price,
                });
                onClose();
              }}>Editar Agendamento</Button>
              {isToday(appointment.initDate) && <Button
                colorScheme={"primary"}
                w={"full"}
                onClick={() => navigate(`${routes.MEDICAL_RECORD.replace(":id", appointment.patient.id)}?appointment=${appointment.id}`)}
              >
                Iniciar Atendimento
              </Button>}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

    </>
  );
}
