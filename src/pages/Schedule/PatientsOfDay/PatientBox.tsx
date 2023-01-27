import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { Appointment } from '../types';
import { format, differenceInMinutes, isBefore } from "date-fns";
import { useNavigate } from 'react-router';
import routes from '../../../routes/routes';


const PatientBox = ({ appointment }: { appointment: Appointment }) => {
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  return <Flex
    className={"px-4 border-b border-gray-900/10"}
    key={appointment.id}
    minH={"70px"}
    flexDir={"column"}
    justifyContent={"center"}
    position={"relative"}
    onMouseOver={onOpen}
    onMouseLeave={onClose}
  >
    <Flex gap={"15px"}>
      <Text color={"primary.500"} fontWeight={"600"} className="text-sm text-gray-900">{`${format(new Date(appointment.initDate), "HH:mm")}`}</Text>
      {!isBefore(new Date(), new Date(appointment.initDate)) &&
        <Text className="text-sm text-gray-500 "><i>{`Aguardando à ${differenceInMinutes(new Date(), new Date(appointment.initDate))} min.`}</i></Text>
      }
    </Flex>
    <Text className="text-sm text-gray-900">{appointment.patient.name}</Text>
    {isOpen && <>
      <Flex
        position={"absolute"}
        top="30%"
        bottom={0}
        left="99%"
        right="-1%"
        bg={"white"}
        zIndex={"30"}
        className={"bg-white border-t border-gray-900/10 pb-4 z-20"}
      />
      <Box
        position={"absolute"}
        top="30%"
        left="100%"
        right="-260px"
        h={"120px"}
        p={"10px"}
        className={"bg-white border border border-gray-900/10 pb-4 z-20"}
      >
        <Text fontSize={"0.9em"} className="text-gray-700">
          Status:
          <Text as={"span"} color={
            appointment.status === "scheduled" ? "yellow.500" :
              appointment.status === "canceled" ? "red.500" :
                appointment.status === "started" ? "blue.500" : "green.500"}>
            {appointment.status === "scheduled" ? "Aguardando Atendimento" :
              appointment.status === "canceled" ? appointment.cancelReason :
                appointment.status === "started" ? "Em Andameneto" : "Finalizado"}
          </Text>
        </Text>
        <Text textTransform={"capitalize"} fontSize={"0.9em"} className="text-gray-700">
          Telefone: {appointment.patient.phone}
        </Text>
        <Text textTransform={"capitalize"} fontSize={"0.9em"} className="text-gray-700">
          Procedimento: {appointment.procedure}
        </Text>
        <Flex w={"full"} justifyContent="center">
          <Button
            colorScheme={"primary"}
            size={"xs"}
            w={"full"}
            fontSize={"0.9em"}
            className="mt-2"
            onClick={() => navigate(`${routes.MEDICAL_RECORD.replace(":id", appointment.patient.id)}?appointment=${appointment.id}`)}>
            Iniciar Atendimento
          </Button>
        </Flex>
      </Box>
    </>
    }
  </Flex>;
}

export default PatientBox;