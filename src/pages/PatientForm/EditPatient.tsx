import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import { PATIENT_QUERY_KEY, findPatientFn } from '../../services/api/patients';
import PatientForm from './PatientForm';

const EditPatients: React.FC = () => {
  const location = useLocation();

  const id = location.pathname.split('/')[2];
  const { data: patients, isLoading } = useQuery([PATIENT_QUERY_KEY, id], () => findPatientFn({ id }));

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