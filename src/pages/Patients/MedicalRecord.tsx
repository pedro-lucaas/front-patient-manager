import { useMediaQuery, Flex, VStack, Box, Tooltip, Icon, Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { AiFillFolderAdd } from 'react-icons/ai';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import routes from '../../routes/routes';
import { APPOINTMENT_QUERY_KEY, listAppointments } from '../Schedule/service';
import { PATIENT_QUERY_KEY, findPatientFn, startAppointmentFn, finishAppointmentFn } from './service';
import { differenceInSeconds } from 'date-fns';

function timeFormatter(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const MedicalRecord: React.FC = () => {
  const [isLargerThan820] = useMediaQuery("(min-width: 820px)");
  const location = useLocation();
  const [duration, setDuration] = React.useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  const id = location.pathname.split('/')[2];

  const { data: patient, isLoading } = useQuery([PATIENT_QUERY_KEY, id], () => findPatientFn({ id }));
  const { data: startedAppointments, refetch } = useQuery([APPOINTMENT_QUERY_KEY, 'started'], () => listAppointments({ status: 'started' }));
  const { mutate: start } = useMutation(startAppointmentFn, {
    onSuccess: () => {
      toast.success('Atendimento iniciado!');
      refetch()
    },
    onError: (e: any) => {
      toast.error(e.response.data.message);
    }
  });
  const { mutate: finish } = useMutation(finishAppointmentFn, {
    onSuccess: () => {
      toast.success('Atendimento finalizado!');
      refetch()
    },
    onError: (e: any) => {
      toast.error(e.response.data.message);
    }
  });

  useEffect(() => {
    if (!startedAppointments || !startedAppointments.items[0]) return
    const updateDuration = () => {
      setDuration(differenceInSeconds(new Date(), new Date(startedAppointments.items[0].initDate)));
    }
    setTimeout(() => updateDuration(), 1000);

  }, [startedAppointments, appointmentId, setDuration, duration]);

  if (isLoading) {
    return <Box>Loading...</Box>
  }

  if (!patient) {
    return <Box>Not found</Box>
  }
  return <Flex w={"full"} gap="15px" flexDir={isLargerThan820 ? "row" : "column"} alignItems={"center"}>
    <Flex className="bg-white border-b border-gray-900/10" minW={"200px"} maxW={isLargerThan820 ? "350px" : "none"} w="full" h="full" direction="column">
      <Box className="px-6 py-4 bg-white  shadow-md ring-1 ring-gray-900/10">
        <h1 className="w-full text-2xl text-gray-900">Prontuário</h1>
      </Box>
      {!!appointmentId ? startedAppointments && startedAppointments.items[0] && startedAppointments.items[0].id === appointmentId ? <>
        <Box className="px-6 py-4 bg-white  shadow-md ring-1 ring-gray-900/10">
          <Button colorScheme={"red"} w={"full"} onClick={() => finish({ id: appointmentId })}>Finalizar Atendimento</Button>
        </Box>
        <Box className="px-6 py-4 bg-white  shadow-md ring-1 ring-gray-900/10">
          Duração: {timeFormatter(duration)}
        </Box>
      </>
        :
        <Box className="px-6 py-4 bg-white  shadow-md ring-1 ring-gray-900/10">
          <Button colorScheme={"blue"} w={"full"} onClick={() => start({ id: appointmentId })}>Iniciar Atendimento</Button>
        </Box>
        : null}
    </Flex>
    <VStack spacing={4} w="full" mt={"50px"} pr={"15px"}>
      <h1 className="w-full text-2xl text-gray-900">{patient.name}</h1>
      <div className="px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
        <Flex className="flex justify-between">
          <h1 className="w-full text-xl text-gray-900">Dados Pessoais</h1>
          <Tooltip label={"Ver Cadastro"}>
            <Button colorScheme="transparent" size="sm" onClick={() => navigate(routes.PATIENT.replace(":id", id))}><Icon as={AiFillFolderAdd} color={"black"} boxSize={"20px"} /></Button>
          </Tooltip>
        </Flex>
        <p className="text-gray-700">Nome: {patient.name}</p>
        <p className="text-gray-700">CPF: {patient.cpf}</p>
        <p className="text-gray-700">Data de Nascimento: {patient.birthDate}</p>
        <p className="text-gray-700">Telefone: {patient.phone}</p>
      </div>
    </VStack >
  </Flex>;
}

export default MedicalRecord;