import { VStack } from '@chakra-ui/react';
import React from 'react';
import { WeekCalendar } from './WeekCalendar';

// import { Container } from './styles';

const Schedule: React.FC = () => {
  return <div>
    <VStack spacing={4} w="full" mt={"50px"} className="container">
      <h1 className="w-full text-2xl text-gray-900">Agenda</h1>
      <WeekCalendar />
    </VStack >
  </div>;
}

export default Schedule;