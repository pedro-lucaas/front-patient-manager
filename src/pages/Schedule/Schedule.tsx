import { Flex, VStack, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { PatientsOfDay } from '../../components/PatientsOfDay';
import { WeekCalendar } from './WeekCalendar';

// import { Container } from './styles';

const Schedule: React.FC = () => {
  const [isLargerThan820] = useMediaQuery("(min-width: 820px)");
  return <Flex w={"full"} gap="15px" flexDir={isLargerThan820 ? "row" : "column"} alignItems={"center"}>
    <PatientsOfDay />
    <VStack spacing={4} w="full" mt={"50px"} className="container" pr={"15px"}>
      <h1 className="w-full text-2xl text-gray-900">Agenda</h1>
      <WeekCalendar />
    </VStack >
  </Flex>;
}

export default Schedule;