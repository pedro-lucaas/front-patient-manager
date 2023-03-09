import { useMediaQuery, Flex, Box, Button } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PATIENT_QUERY_KEY, findPatientFn } from '../../services/api/patients';
import { APPOINTMENT_QUERY_KEY, getAppointment, updateAppointmentFn } from '../../services/api/appointments';
import { MedicalRecordHeader } from './components/MedicalRecordHeader';
import { Timer } from './components/Timer';
import { MedicalRecordEdit } from './components/MedicalRecordEdit';
import { MedicalRecordHistory } from './components/MedicalRecordHistory';

const MedicalRecord: React.FC = () => {
  const [isLargerThan820] = useMediaQuery("(min-width: 820px)");

  const { id } = useParams();
  const { data: patient, isLoading: patientLoading } = useQuery([PATIENT_QUERY_KEY, id], () => findPatientFn({ id }), {
    enabled: !!id,
  });

  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  const { data: startedAppointment, refetch, isLoading: appointmentLoading } = useQuery([APPOINTMENT_QUERY_KEY, 'started'], () => getAppointment({ id: appointmentId }));
  const isStarted = !!appointmentId && startedAppointment && startedAppointment.status === 'started';

  const handleInitAppointment = async () => {
    if (!appointmentId) return;
    try {
      await updateAppointmentFn({ appointmentId, status: 'started' });
      toast.success('Atendimento iniciado!');
      refetch();
    } catch (e: any) {
      toast.error(e.response.data.message);
    }
  };

  const handleFinishAppointment = async () => {
    if (!appointmentId) return;
    try {
      await updateAppointmentFn({ appointmentId, status: 'finished' });
      toast.success('Atendimento finalizado!');
      refetch();
    } catch (e: any) {
      toast.error(e.response.data.message);
    }
  };

  if (patientLoading || appointmentLoading) {
    return <Box>Loading...</Box>
  }

  if (!patient) {
    return <Box>Not found</Box>
  }
  return (
    <Flex w={"full"} gap="15px" flexDir={isLargerThan820 ? "row" : "column"} alignItems={"center"}>
      <Flex
        className="bg-white border-b border-gray-900/10"
        minW={"200px"}
        maxW={isLargerThan820 ? "350px" : "none"}
        w={"full"}
        h={isLargerThan820 ? "full" : "auto"}
        direction="column"
      >
        <Box className="px-6 py-4 bg-white  shadow-md ring-1 ring-gray-900/10">
          <h1 className="w-full text-2xl text-gray-900">Prontuário</h1>
        </Box>
        {isStarted && (
          <>
            <Box className="px-6 py-4 bg-white  shadow-md ring-1 ring-gray-900/10">
              <Button colorScheme={"red"} w={"full"} onClick={handleFinishAppointment}>Finalizar Atendimento</Button>
            </Box>
            <Timer dateTime={new Date(startedAppointment?.initDate || '')} />
          </>
        )}
        {appointmentId && !isStarted && (
          <Box className="px-6 py-4 bg-white  shadow-md ring-1 ring-gray-900/10">
            <Button colorScheme={"blue"} w={"full"} onClick={handleInitAppointment}>Iniciar Atendimento</Button>
          </Box>
        )}
      </Flex>
      <Flex w={"full"} h={"full"} flexDir={"column"} gap={"15px"} align={"center"}>
        <MedicalRecordHeader patient={patient} />
        {isStarted && <MedicalRecordEdit appointment={startedAppointment} />}
        {!isStarted && <MedicalRecordHistory patientId={patient.id} />}
      </Flex>
    </Flex>
  );
}

export default MedicalRecord;