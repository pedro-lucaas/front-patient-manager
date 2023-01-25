import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import PatientForm from './PatientForm';
import { findPatientFn, PATIENT_QUERY_KEY } from './service';

const EditPatients: React.FC = () => {
  const location = useLocation();

  const id = location.pathname.split('/')[2];

  const { data, isLoading } = useQuery([PATIENT_QUERY_KEY, id], () => findPatientFn({ id }));

  if (isLoading) {
    return <Box>Loading...</Box>
  }

  return (
    <VStack spacing={4} w="full" mt={"10"}>
      <div className="container px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
        {data && <PatientForm values={data} />}
      </div>
    </VStack>
  );

}

export default EditPatients;