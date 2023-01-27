import { Box, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

export const HeadRow = ({ row }: { row: any }) => {
  return (
    <Box
      w="100%"
      h="100%"
      bg="transparent"
      position={"relative"}
    >
      <Text fontSize={"0.9em"} position={"absolute"} right={0} top={0} transform={"translate(0,-50%)"}>
        {format(row.sunday, "HH:mm")}
      </Text>
    </Box>
  );
}
