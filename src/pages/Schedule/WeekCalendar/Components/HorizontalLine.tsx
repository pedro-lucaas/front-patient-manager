import { Box } from '@chakra-ui/react';

export const HorizontalLine = ({ date }: { date: Date }) => {
  return (
    <Box
      position={"absolute"}
      top={`${date.getMinutes() * 100 / 60}%`}
      left={0}
      right={"-5px"}
      height={"2px"}
      zIndex={2}
    >
      <Box position={"relative"} w={"100%"} h={"100%"} bg={"#e53e3e"}>
        <Box position={"absolute"} top={"-5px"} left={"-5px"} w={"10px"} h={"10px"} bg={"#e53e3e"} zIndex={2} borderRadius={"5px"} />
      </Box>
    </Box>
  );
}