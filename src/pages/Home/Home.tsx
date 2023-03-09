import React from 'react';
import { Flex, useMediaQuery } from '@chakra-ui/react';
import { NextAppointments } from '../../components/NextAppointments';
import { PatientsOfDay } from '../../components/PatientsOfDay';

export enum visualizeEnum {
  viewAll = 'viewAll',
  viewConfirmed = 'viewConfirmed',
  viewNotConfirmed = 'viewNotConfirmed'
}

const Home: React.FC = () => {
  const [isLargerThan820] = useMediaQuery("(min-width: 820px)");
  return (
    <Flex w={"full"} gap="15px" flexDir={isLargerThan820 ? "row" : "column"} alignItems={"center"}>
      <NextAppointments />
      <PatientsOfDay />
    </Flex>

  );
}

export default Home;