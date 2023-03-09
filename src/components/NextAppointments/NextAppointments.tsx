import { Text, Flex, Radio, RadioGroup, useMediaQuery } from '@chakra-ui/react';
import { addDays, addWeeks, setHours, setMinutes, setSeconds } from 'date-fns';
import React from 'react';
import { useQuery } from 'react-query';
import { APPOINTMENT_QUERY_KEY, listAppointments } from '../../services/api/appointments';
import { NextAppointmentsItem } from './NextAppointmentsItem';

export enum visualizeEnum {
  viewAll = 'viewAll',
  viewConfirmed = 'viewConfirmed',
  viewNotConfirmed = 'viewNotConfirmed'
}

const NextAppointments: React.FC = () => {
  const [visualize, setVisualize] = React.useState<keyof typeof visualizeEnum>("viewAll");
  const [isLargerThan820] = useMediaQuery("(min-width: 820px)");

  const initDate = setHours(setMinutes(setSeconds(addDays(new Date(), 1), 0), 0), 0).toISOString();
  const endDate = addWeeks(new Date(initDate), 2).toISOString();

  const { data, isLoading } = useQuery([APPOINTMENT_QUERY_KEY, "scheduled"], () => listAppointments({ status: "scheduled", initDate, endDate }));
  const appointments =
    visualize === 'viewAll' ? data?.items :
      visualize === 'viewConfirmed' ? data?.items.filter((item) => item.confirmedBy) :
        data?.items.filter((item) => !item.confirmedBy);

  if (isLoading) return <div>Carregando...</div>

  return (
    <Flex className="bg-white shadow-md ring-1 ring-gray-900/10 pb-4" minW={"200px"} maxW={isLargerThan820 ? "350px" : "none"} w="full" h="full" direction="column">
      <Flex minH={"120px"} direction={"column"} justify={"center"} className={"px-4 border-y border-gray-900/10"}>
        <Text className="w-full text-xl text-gray-900">Próximas Consultas</Text>
        <RadioGroup display={"flex"} colorScheme={"yellow"} size={"sm"} defaultValue={visualize} onChange={(value) => setVisualize(value as keyof typeof visualizeEnum)}>
          <Radio value='viewAll'>Ver todos</Radio>
          <Radio value='viewConfirmed'>Ver confirmados</Radio>
          <Radio value='viewNotConfirmed'>Ver não confirmados</Radio>
        </RadioGroup>
      </Flex>
      {appointments && appointments.map((appointment) => {
        return <div key={appointment.id}>
          <NextAppointmentsItem appointment={appointment} />
        </div>
      })}
    </Flex>
  );
}

export default NextAppointments;