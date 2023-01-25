import React from 'react';
import { useAuth } from '../../context/AuthProvider/useAuth';
import { useConfig } from '../../context/ConfigProvider/useConfig';
import { PatternFormat } from 'react-number-format';
import { Button, Flex, Input, VStack } from '@chakra-ui/react';
import { toast } from 'react-toastify';
// import { Container } from './styles';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { attributes, createAttribute, deleteAttribute } = useConfig();
  const [attribute, setAttribute] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreateAttribute = () => {
    if (!attribute) {
      toast.error('Name is required');
      return;
    };
    createAttribute(attribute.toLowerCase(), "");
    setIsCreating(false);
    setAttribute("")
  }

  return (
    <VStack spacing={4} w="full" justifyContent={{ sm: "center" }}>
      <div className="w-full px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Perfil</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user?.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user?.email}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"><PatternFormat value={user?.phone} format={"(##) #####-####"} /></dd>
            </div>
          </div>
        </div>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg mt-20">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configurações</h3>
          </div>
          <div className="flex justify-between bg-gray-50 px-8 py-2 my-3 border-b">
            <h4 className="text-gray-500">Atributos adicionais</h4>
            <Button colorScheme={"blue"} ml={"auto"} size={"sm"} onClick={() => setIsCreating(!isCreating)}>Add</Button>
          </div>
          <Flex justifyContent="center" alignItems="center" flexDirection="column">
            {attributes?.map(attribute => (
              <Flex
                key={attribute.name}
                justifyContent="space-between"
                w={"100%"}
                h={"50px"}
                px={8}
              >
                <Flex textTransform={"capitalize"}>
                  <span>{attribute.name}</span>
                </Flex>
                <Button colorScheme={"red"} onClick={() => deleteAttribute(attribute.name)}> - </Button>
              </Flex>
            ))}
            {isCreating && (
              <Flex
                justifyContent="space-between"
                w={"100%"}
                h={"50px"}
                pr={8}
                pl={4}
                gap={2}
              >
                <Input
                  id='name'
                  placeholder='Nome'
                  type={"text"}
                  value={attribute}
                  onChange={(e) => setAttribute(e.target.value)}
                />
                <Button colorScheme={"whatsapp"} fontSize={"0.7em"} onClick={handleCreateAttribute}>
                  Salvar
                </Button>
                <Button colorScheme={"red"} onClick={() => setIsCreating(false)}>
                  -
                </Button>
              </Flex>
            )}
          </Flex>
        </div>
      </div>
    </VStack>
  )
}

// return <div>
//   <h1>Profile</h1>
//   <h2>{user?.name}</h2>
//   <h2>{user?.email}</h2>
//   <h2>{user?.phone}</h2>
//   <h1>Attributes</h1>
//   <ul>
//     {attributes?.map(attribute => (
//       <li key={attribute.name}>
//         <span>{attribute.name}</span>
//         <span>{attribute.tag}</span>
//         <button onClick={() => deleteAttribute(attribute.name)}>Delete</button>
//       </li>
//     ))}
//   </ul>
//   <button onClick={() => createAttribute('test', 'test')}>Create</button>

// </div>;
export default Profile;