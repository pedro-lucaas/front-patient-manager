import React from 'react';
import { Flex } from '@chakra-ui/react';

const SignDashboard = ({ children }: { children: JSX.Element }) => {
  return <Flex bg={"primary.100"} minW={"100%"} minH={"100%"} flexGrow={1} alignItems={'center'} justifyContent={'center'}>
    <Flex bg={"gray.200"} w={"400px"} h={"500px"} borderRadius={"md"} boxShadow={"md"} p={4} flexDir={"column"} alignItems={'center'} justifyContent={'center'}>
      {children}
    </Flex>
  </Flex>
}

export default SignDashboard;