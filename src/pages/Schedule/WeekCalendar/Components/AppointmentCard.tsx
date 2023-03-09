import { Box, Button, Divider, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  setYear,
  isToday
} from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router';
import routes from '../../../../routes/routes';
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';
import { numericFormatter } from 'react-number-format'
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineMan, AiOutlineWoman } from 'react-icons/ai';
import { MdCancel, MdCheckCircle, MdSchedule } from 'react-icons/md';
import { BiTrash } from 'react-icons/bi';
import { APPOINTMENT_QUERY_KEY, deleteAppointmentFn, updateAppointmentFn } from '../../../../services/api/appointments';
import { Appointment, AppointmentFormType, AppointmentStatusEnum } from '../../../../services/api/appointments/types';

export const AppointmentCard = ({ appointment, onEdit }: { appointment: Appointment, onEdit: (formValues: AppointmentFormType) => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box
        position={"absolute"}
        top={`${appointment.initDate.getMinutes() * 100 / 60}%`}
        left={0}
        right={0}
        height={`${((appointment.endDate.getHours() - appointment.initDate.getHours()) * 60 + appointment.endDate.getMinutes() - appointment.initDate.getMinutes()) / 60 * 100}%`}
        bg={"yellow.400"}
        color={"yellow.700"}
        padding={"5px"}
        zIndex={1}
        fontSize={"0.8em"}
        overflow={"hidden"}
        borderColor={"yellow.600"}
        borderWidth={"1px"}
        borderRadius={"5px"}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <Box
          position={"relative"}
          top={0}
          right={0}
          left={0}
          height={"100%"}
        >
          {appointment.patient.sex === "M" && <Icon as={AiOutlineMan} position={"absolute"} right={-1} bottom={-1} color={"blue.500"} boxSize={"12px"} />}
          {appointment.patient.sex === "F" && <Icon as={AiOutlineWoman} position={"absolute"} right={-1} bottom={-1} color={"pink.500"} boxSize={"12px"} />}
          {appointment.status === AppointmentStatusEnum.finished && <Icon as={MdCheckCircle} position={"absolute"} right={-1} top={-1} color={"green.500"} boxSize={"12px"} />}
          {appointment.status === AppointmentStatusEnum.canceled && <Icon as={MdCancel} position={"absolute"} right={-1} top={-1} color={"red.500"} boxSize={"12px"} />}
          {appointment.status === AppointmentStatusEnum.scheduled && <Icon as={MdSchedule} position={"absolute"} right={-1} top={-1} color={"gray.800"} boxSize={"12px"} />}
          {appointment.status === AppointmentStatusEnum.started && <Box position={"absolute"} className={"pulse-animation"} right={-1} top={-1} w={"6px"} h={"6px"} />}
          {`${format(appointment.initDate, "HH:mm")} - ${format(appointment.endDate, "HH:mm")}`}
          <Text fontWeight={"bold"}>{appointment.patient.name}</Text>
        </Box>
      </Box>
      <AppointmentDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        appointment={appointment}
        onEdit={onEdit}
      />
    </>
  );
}

const AppointmentDetailsModal = ({ isOpen, onClose, appointment, onEdit }: { isOpen: boolean, onClose: () => void, appointment: Appointment, onEdit: (formValues: AppointmentFormType) => void }) => {
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
  const deleteAppointment = async () => {
    try {
      await deleteAppointmentFn({
        id: appointment.id,
      })
      toast.success("Consulta cancelada com sucesso!");
      queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY);
    } catch (error) {
      toast.error("Ocorreu um erro ao cancelar consulta!");
    }
  }
  const cancelAppointment = async () => {
    try {
      await updateAppointmentFn({
        appointmentId: appointment.id,
        status: AppointmentStatusEnum.canceled,
      })
      toast.success("Consulta cancelada com sucesso!");
      queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY);
    } catch (error) {
      toast.error("Ocorreu um erro ao cancelar consulta!");
    }
  }


  let appointmentTimeFormated = `${format(appointment.initDate, "PPPP", { locale: pt })} - ${format(appointment.initDate, "HH:mm")} às ${format(appointment.endDate, "HH:mm")}`;
  appointmentTimeFormated = appointmentTimeFormated.charAt(0).toUpperCase() + appointmentTimeFormated.slice(1);

  return (<Modal
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
          {appointment.status === AppointmentStatusEnum.finished && <Box >Status:<Text color={"green.500"} as={"span"}> Finalizado <Icon as={MdCheckCircle} boxSize={"12px"} /></Text></Box>}
          {appointment.status === AppointmentStatusEnum.canceled && <Box >Status:<Text color={"red.500"} as={"span"}> Cancelado <Icon as={MdCancel} boxSize={"12px"} /></Text></Box>}
          {appointment.status === AppointmentStatusEnum.started && <Box display={"flex"} >Status:<Text color={"blue.500"} as={"span"}> Em andamento </Text> <Box className={"pulse-animation"} w={"9px"} h={"9px"} /></Box>}
          {appointment.status === AppointmentStatusEnum.scheduled && (
            <Menu placement="right-start">
              <MenuButton>
                Status: <Text as={"span"} color={"blue.600"}>Agendado{isToday(appointment.initDate) ? " - Aguardando atendimento" : ""}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={cancelAppointment}>Cancelar Atendimento</MenuItem>
              </MenuList>
            </Menu>
          )}
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
          <Button cursor={"pointer"} p={"6px"} size={"md"} variant={"outline"} onClick={deleteAppointment}><Icon as={BiTrash} /></Button>
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
          {(isToday(appointment.initDate) || appointment.status === AppointmentStatusEnum.started) && <Button
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
  );
}

