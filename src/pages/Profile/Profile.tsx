import React from 'react';
import { useAuth } from '../../context/AuthProvider/useAuth';
import { useConfig } from '../../context/ConfigProvider/useConfig';
import { PatternFormat, patternFormatter } from 'react-number-format';
import { Button, Checkbox, Flex, HStack, Input, VStack } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { addHours, addMinutes, differenceInMinutes, format, startOfToday } from 'date-fns';
// import { Container } from './styles';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { attributes, createAttribute, deleteAttribute, workingTime, setWorkingTime, lunchTime, setLunchTime, inativeDays, setInativeDays } = useConfig();
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
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user?.phone && patternFormatter(user.phone, { format: "(##) #####-####" })}</dd>
            </div>
          </div>
        </div>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg mt-20">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configurações</h3>
          </div>
          <div>
            <h4 className="px-8 pt-4 text-gray-500">Atributos adicionais</h4>
            <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={"20px"}>
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
            {!isCreating &&
              <div className="flex justify-between bg-gray-50 px-8 py-3 border-b">
                <Button colorScheme={"primary"} ml={"auto"} size={"sm"} onClick={() => setIsCreating(!isCreating)}>Add</Button>
              </div>
            }

          </div>
          <div>
            <h4 className="px-8 pt-4 text-gray-500">Configurações da Agenda</h4>
            <div className="bg-gray-50 px-8 py-2 my-3 border-b items-center">
              <span>Horário de funcionamento</span>
              <HStack mb={"20px"}>
                <Input type="number"
                  value={workingTime.start}
                  as={PatternFormat}
                  format={"##"}
                  onChange={(e) => setWorkingTime({
                    start: parseInt(e.target.value),
                    end: workingTime.end
                  })}
                  onBlur={() => toast.success('Horário de funcionamento atualizado')}
                />
                <Input type="number"
                  value={workingTime.end}
                  as={PatternFormat}
                  format={"##"}
                  onChange={(e) => setWorkingTime({
                    start: workingTime.start,
                    end: parseInt(e.target.value)
                  })}
                  onBlur={() => toast.success('Horário de funcionamento atualizado')}
                />
              </HStack>
              <span>Horário de almoço</span>
              <HStack mb={"20px"}>
                <Input type="text"
                  as={PatternFormat}
                  format={"##:##"}
                  value={format(addMinutes(startOfToday(), lunchTime?.start || 0), "HH:mm")}
                  isAllowed={(values: any) => {
                    const { formattedValue } = values;
                    const hours = parseInt(formattedValue.substr(0, 2));
                    const minutes = parseInt(formattedValue.substr(3, 2));
                    if (hours > 23 || minutes > 59) {
                      return false;
                    }
                    return true;
                  }}
                  onValueChange={(value: any) => {
                    const { formattedValue } = value;
                    const hours = parseInt(formattedValue.substr(0, 2));
                    const minutes = parseInt(formattedValue.substr(3, 2));
                    setLunchTime({
                      start: differenceInMinutes(addHours(addMinutes(startOfToday(), minutes), hours), startOfToday()),
                      end: lunchTime?.end ?? differenceInMinutes(startOfToday(), addHours(addMinutes(startOfToday(), minutes), hours)) + 60
                    })
                  }}
                  onBlur={() => toast.success('Horário de almoço atualizado')}
                />
                <Input type="text"
                  as={PatternFormat}
                  format={"##:##"}
                  value={format(addMinutes(startOfToday(), lunchTime?.end || 0), "HH:mm")}
                  isAllowed={(values: any) => {
                    const { formattedValue } = values;
                    const hours = parseInt(formattedValue.substr(0, 2));
                    const minutes = parseInt(formattedValue.substr(3, 2));
                    if (hours > 23 || minutes > 59) {
                      return false;
                    }
                    return true;
                  }}
                  onValueChange={(value: any) => {
                    const { formattedValue } = value;
                    const hours = parseInt(formattedValue.substr(0, 2));
                    const minutes = parseInt(formattedValue.substr(3, 2));
                    setLunchTime({
                      start: lunchTime?.start ?? differenceInMinutes(startOfToday(), addHours(addMinutes(startOfToday(), minutes), hours)) - 60,
                      end: differenceInMinutes(addHours(addMinutes(startOfToday(), minutes), hours), startOfToday())
                    })
                  }}
                  onBlur={() => toast.success('Horário de almoço atualizado!')}
                />
              </HStack>
              <span>Dias de funcionamento</span>
              <HStack onChange={() => toast.success('Dias de funcionamento atualizados!')}>
                <Checkbox isChecked={!inativeDays.sunday} onChange={(e) => setInativeDays({ ...inativeDays, sunday: !e.target.checked })}>Domingo</Checkbox>
                <Checkbox isChecked={!inativeDays.monday} onChange={(e) => setInativeDays({ ...inativeDays, monday: !e.target.checked })}>Segunda</Checkbox>
                <Checkbox isChecked={!inativeDays.tuesday} onChange={(e) => setInativeDays({ ...inativeDays, tuesday: !e.target.checked })}>Terça</Checkbox>
                <Checkbox isChecked={!inativeDays.wednesday} onChange={(e) => setInativeDays({ ...inativeDays, wednesday: !e.target.checked })}>Quarta</Checkbox>
                <Checkbox isChecked={!inativeDays.thursday} onChange={(e) => setInativeDays({ ...inativeDays, thursday: !e.target.checked })}>Quinta</Checkbox>
                <Checkbox isChecked={!inativeDays.friday} onChange={(e) => setInativeDays({ ...inativeDays, friday: !e.target.checked })}>Sexta</Checkbox>
                <Checkbox isChecked={!inativeDays.saturday} onChange={(e) => setInativeDays({ ...inativeDays, saturday: !e.target.checked })}>Sábado</Checkbox>
              </HStack>

            </div>
          </div>
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