import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { useQuery } from 'react-query';
import { Pagination } from '../../../../helpers/Pagination';
import { APPOINTMENT_QUERY_KEY } from '../../../../services/api/appointments';
import { Appointment } from '../../../../services/api/appointments/types';
import { listPatientAppointmentsFn } from '../../../../services/api/patients';

export type MedicalRecordHistoryProps = {
  patientId: string;
};

const MedicalRecordHistory: React.FC<MedicalRecordHistoryProps> = ({ patientId }) => {
  const [appointments, setAppointments] = React.useState<Pagination<Appointment> | undefined>();
  const [page, setPage] = React.useState(1);

  const { isLoading } = useQuery([APPOINTMENT_QUERY_KEY, patientId, page], () => listPatientAppointmentsFn({ id: patientId, page, limit: 2, status: "finished" }), {
    onSuccess: (data) => {
      setAppointments(state => (
        state ? {
          ...data,
          items: [...state.items, ...data.items.filter(appointment => !state.items.find(stateAppointment => stateAppointment.id === appointment.id))],
        } : data
      ));
    }
  });

  const hasMore = appointments ? appointments.totalPages > page : false;

  return (
    <Flex w="full" h="full" p={"10px"} direction={"column"} gap={5}>
      {!isLoading && !appointments?.items.length && (
        <Flex w="full" h="full" align={"center"} justify={"center"} p={"35px"}>
          <Flex
            className="bg-white shadow-md"
            w="full"
            h="full"
            maxW={"500px"}
            maxH={"300px"}
            justify={"center"}
            align={"center"}
            borderRadius={"md"}
            border={"1px dashed gray"}
          >
            <Text> Primeira consulta </Text>
          </Flex>
        </Flex>
      )}
      {appointments?.items.map((appointment) => (
        <Flex key={appointment.id} >
          <Flex h={"full"} direction={"column"} align={"center"}>
            <Box h={"60px"} w={"60px"} p={1} borderRadius={"md"} bg={"gray.400"} color={"white"} >
              <Text lineHeight={"6"} fontSize={"1.6em"} textAlign={"center"}>{format(appointment.initDate, "dd")}</Text>
              <Text lineHeight={"3"} fontSize={"0.8em"} textAlign={"center"}>{format(appointment.initDate, "MMM")}</Text>
              <Text lineHeight={"4"} fontSize={"0.9em"} textAlign={"center"}>{format(appointment.initDate, "yyyy")}</Text>
            </Box>
            <Box h={"full"} w={"4px"} bg={"gray.400"} />
          </Flex>
          <Box className="bg-white shadow-md ring-1 ring-gray-900/10" w="full" h="full" m={"5px"}>
            {JSON.parse(appointment.medicalRecord)?.map((record: any, index: number) => (
              <Flex key={index} direction={"column"}>
                <Flex direction={"column"} gap={2} bg={"gray.200"} p={4}>
                  <Text fontSize={"1.2em"} fontWeight={"bold"}>{record.title}</Text>
                </Flex>
                <Flex direction={"column"} gap={2} p={4} dangerouslySetInnerHTML={{ __html: record.content }} />
              </Flex>
            ))}
          </Box>
        </Flex>
      ))}
      {/* Ver mais */}
      {hasMore && <Flex w="full" h="full" p={"10px"} direction={"column"} gap={5}>
        {isLoading && <Flex justifyContent={"center"}>
          <Spinner />
        </Flex>}
        <Button
          colorScheme="blue"
          variant="outline"
          w="full"
          h="full"
          p={"10px"}
          onClick={() => setPage(state => state + 1)}
        >
          Ver mais
        </Button>
      </Flex>}
    </Flex>
  );
}

export default MedicalRecordHistory;