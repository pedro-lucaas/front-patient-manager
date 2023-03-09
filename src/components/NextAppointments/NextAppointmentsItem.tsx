import { Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { FaCheck, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import { updateAppointmentFn, APPOINTMENT_QUERY_KEY } from '../../services/api/appointments';
import { Appointment, ConfirmedBy } from '../../services/api/appointments/types';

export const NextAppointmentsItem = ({ appointment }: { appointment: Appointment }) => {
  const queryClient = useQueryClient();
  const whatsappText = `Olá, ${appointment.patient.name}! Estamos entrando em contato para confirmar sua consulta marcada para o dia ${format(new Date(appointment.initDate), "dd/MM, EEEE 'às' HH:mm", {
    locale: ptBR,
  })}. Qualquer dúvida, estamos à disposição.`;

  const formattedPhone = appointment.patient.phone.replace(/\D/g, '');
  const phoneLink = `tel:55${formattedPhone}`;
  const whatsappLink = `https://api.whatsapp.com/send?phone=55${appointment.patient.phone}&text=${whatsappText}`;
  const emailLink = `mailto:${appointment.patient.email}`;

  const { mutateAsync } = useMutation((confirmedBy: ConfirmedBy) => updateAppointmentFn({ appointmentId: appointment.id, confirmedBy }), {
    onSuccess: () => {
      queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY);
    },
  });

  return (
    <Flex
      className={"px-4 border-b border-gray-900/10"}
      key={appointment.id}
      minH={"70px"}
      flexDir={"column"}
      justifyContent={"center"}
      position={"relative"}
      py={2}
    >
      <Text maxW={"50%"} className="text-sm text-gray-900">{appointment.patient.name}</Text>
      <Text color={"primary.500"} fontWeight={"600"} className="text-sm text-gray-900">
        {`${format(new Date(appointment.initDate), "dd/MM, EEEE 'às' HH:mm", {
          locale: ptBR,
        })}`}
      </Text>
      <Text className="text-sm text-gray-900">{appointment.patient.phone}</Text>
      <Text className="text-sm text-gray-900">{appointment.patient.email}</Text>
      <Flex position={"absolute"} right={"0"} top={"0"} className="text-gray-900">
        <IconButton as={"a"} href={whatsappLink} target={"_blank"} size={"md"} className="ml-2" aria-label="WhatsApp" icon={<FaWhatsapp />} />
        <IconButton as={"a"} href={emailLink} size={"md"} className="ml-2" aria-label="Email" icon={<FaEnvelope />} />
        <IconButton as={"a"} href={phoneLink} size={"md"} className="ml-2" aria-label="Phone" icon={<FaPhone />} />
      </Flex>
      <Menu>
        <MenuButton>
          {appointment.confirmedBy === "WHATSAPP" && <Flex alignItems={"center"}><FaCheck color={"green"} /><Text ml={2}>Confirmado por WhatsApp</Text><FaWhatsapp /></Flex>}
          {appointment.confirmedBy === "PHONE" && <Flex alignItems={"center"}><FaCheck color={"green"} /><Text ml={2}>Confirmado por Telefone</Text><FaPhone /></Flex>}
          {appointment.confirmedBy === "EMAIL" && <Flex alignItems={"center"}><FaCheck color={"green"} /><Text ml={2}>Confirmado por Email</Text><FaEnvelope /></Flex>}
          {!appointment.confirmedBy && <Text>Confirmar</Text>}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => mutateAsync("WHATSAPP")}>Confirmado por WhatsApp</MenuItem>
          <MenuItem onClick={() => mutateAsync("PHONE")}>Confirmado por Telefone</MenuItem>
          <MenuItem onClick={() => mutateAsync("EMAIL")}>Confirmado por Email</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
