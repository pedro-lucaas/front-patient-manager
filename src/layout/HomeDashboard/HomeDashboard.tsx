import { Box, Button, Flex, HStack, Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthProvider/useAuth';
import redirects from '../../routes/routes';
import { HiUserCircle, HiPlusCircle } from 'react-icons/hi';

const HeaderMenuItem = ({ children, to }: { children: string, to: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return <Button
    color={"white"}
    fontWeight={"500"}
    borderRadius={"0"}
    bg={location.pathname === to ? "primary.700" : "primary.500"}
    _hover={location.pathname === to ? { bg: "primary.700" } : { bg: "primary.600" }}
    _active={{}}
    onClick={() => navigate(to)}
  >
    {children}
  </Button>
}


const HomeDashboard: React.FC<{ children: any }> = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!auth.user) {
    return <Navigate to={redirects.LOGIN} state={{ from: location }} replace />;
  }

  return <Flex flexDir={"column"} minW={"100%"} minH={"100%"}>
    <Flex h={"50px"} w={"100%"} bg={"primary.500"} justifyContent={"space-between"}>
      <Box>Logo</Box>
      <HStack spacing={4}>
        <HeaderMenuItem to={redirects.SCHEDULE}>
          Agenda
        </HeaderMenuItem>
        <HeaderMenuItem to={redirects.MEDICAL_RECORDS}>
          Prontuários
        </HeaderMenuItem>
      </HStack>
      <Flex gap={4}>
        <Menu>
          <MenuButton>
            <Icon as={HiPlusCircle} h={"25px"} w={"auto"} color={"white"} />
          </MenuButton>
          <MenuList m={0}>
            <MenuItem onClick={() => navigate(redirects.NEWPATIENT)}>Paciente</MenuItem>
            <MenuItem >Agenda</MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton>
            <Icon as={HiUserCircle} h={"40px"} w={"auto"} color={"primary.900"} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate(redirects.PROFILE)}>Perfil</MenuItem>
            <MenuItem onClick={() => auth.logout()}>Sair</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
    <Flex bg={"gray.100"} flexGrow={1} justifyContent={"center"}>
      {children}
    </Flex>
  </Flex>;
}

export default HomeDashboard;