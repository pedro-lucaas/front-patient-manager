import { Box } from '@chakra-ui/react';
import { differenceInSeconds } from 'date-fns';
import React, { useState } from 'react';

export type TimerProps = {
  dateTime: Date;
};

const Timer: React.FC<TimerProps> = ({ dateTime }) => {
  const [duration, setDuration] = useState(0);

  const updateDuration = () => {
    setDuration(differenceInSeconds(new Date(), dateTime));
  }
  setTimeout(() => updateDuration(), 1000);

  const timeFormatter = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <Box className="px-6 py-4 bg-white  shadow-md ring-1 ring-gray-900/10">
      Duração: {timeFormatter(duration)}
    </Box>
  );
}

export default Timer;