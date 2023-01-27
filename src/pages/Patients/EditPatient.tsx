import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import PatientForm from './PatientForm';
import { findPatientFn, PATIENT_QUERY_KEY } from './service';

const EditPatients: React.FC = () => {
  const location = useLocation();

  const id = location.pathname.split('/')[2];
  const { data: patients, isLoading } = useQuery([PATIENT_QUERY_KEY, id], () => findPatientFn({ id }));
  // const { data: appointments, isLoading: isLoadingAppointments } = useQuery([PATIENT_QUERY_KEY, id, APPOINTMENT_QUERY_KEY], () => listPatientAppointmentsFn({ id, page }));

  if (isLoading) {
    return <Box>Loading...</Box>
  }

  if (!patients) {
    return <Box>Not found</Box>
  }
  // const text = `<b>aaaaaaaaaaaaa adsas asd aaaaa aaaaaaaaaaa
  // aaaaa</b>`
  // const html = text.replace(/(?:\r)/g, '').replace(/(?:\n)/g, '<br />');
  return (
    <VStack spacing={4} w="full" mt={"10"}>
      <div className="container px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
        {patients && <PatientForm values={patients} />}
        {/* {text && <div dangerouslySetInnerHTML={{ __html: html }} />} */}
      </div>
    </VStack>
  );

}

export default EditPatients;