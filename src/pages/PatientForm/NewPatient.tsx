import { VStack } from '@chakra-ui/react';
import React from 'react';
import PatientForm from './PatientForm';

const NewPatients: React.FC = () => {
  return (
    <VStack spacing={4} w="full" mt={10}>
      <div className="container px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
        <PatientForm />
      </div>
    </VStack>
  );

}

export default NewPatients;