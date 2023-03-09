import React from 'react';
import { useAuth } from '../../context/AuthProvider/useAuth';
import { NumericFormat, PatternFormat, patternFormatter } from 'react-number-format';
import { Checkbox, HStack, Input, VStack } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { addHours, addMinutes, differenceInMinutes, format, startOfToday } from 'date-fns';
// import { Container } from './styles';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  if (!user) return null;

  const setWorkingTime = async ({ start, end }: { start: number, end: number }) => {
    if (start > end) return toast.error("Horário de início não pode ser maior que o horário de término!")
    if (!start || !end) return
    await updateProfile({ workTime: JSON.stringify([start, end]) })
    toast.success("Horário de trabalho atualizado com sucesso!")
  }

  const setLunchTime = async ({ start, end }: { start: number, end: number }) => {
    if (start > end) return toast.error("Horário de início não pode ser maior que o horário de término!")
    if (isNaN(start) || isNaN(end)) return
    await updateProfile({ lunchTime: JSON.stringify([start, end]) })
    toast.success("Horário de almoço atualizado com sucesso!")
  }

  const toggleDayIsActive = async (day: number) => {
    const { inactiveDays } = user
    const newInactiveDays = inactiveDays.includes(day) ? inactiveDays.filter((d: number) => d !== day) : [...inactiveDays, day]
    await updateProfile({ inactiveDays: JSON.stringify(newInactiveDays) })
    toast.success("Dias de inatividade atualizados com sucesso!")
  }

  const { workTime, lunchTime, inactiveDays } = user
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
            <h4 className="px-8 pt-4 text-gray-500">Configurações da Agenda</h4>
            <div className="bg-gray-50 px-8 py-2 my-3 border-b items-center">
              <span>Horário de funcionamento</span>
              <HStack mb={"20px"}>
                <Input
                  value={workTime[0].toString()}
                  as={NumericFormat}
                  suffix=":00"
                  fixedDecimalScale={true}
                  decimalScale={0}
                  onBlur={(e) => setWorkingTime({
                    start: parseInt(e.target.value),
                    end: workTime[1]
                  })}
                />
                <Input
                  value={workTime[1].toString()}
                  as={NumericFormat}
                  suffix=":00"
                  fixedDecimalScale={true}
                  decimalScale={0}
                  onBlur={(e) => setWorkingTime({
                    start: workTime[0],
                    end: parseInt(e.target.value)
                  })}
                />
              </HStack>
              <span>Horário de almoço</span>
              <HStack mb={"20px"}>
                <Input type="text"
                  as={PatternFormat}
                  format={"##:##"}
                  value={format(addMinutes(startOfToday(), lunchTime[0] || 0), "HH:mm")}
                  isAllowed={(values: any) => {
                    const { formattedValue } = values;
                    const hours = parseInt(formattedValue.substr(0, 2));
                    const minutes = parseInt(formattedValue.substr(3, 2));
                    if (hours > 23 || minutes > 59) {
                      return false;
                    }
                    return true;
                  }}
                  onBlur={(e) => {
                    const hours = parseInt(e.target.value.substr(0, 2));
                    const minutes = parseInt(e.target.value.substr(3, 2));
                    setLunchTime({
                      start: differenceInMinutes(addHours(addMinutes(startOfToday(), minutes), hours), startOfToday()),
                      end: lunchTime[1] ?? differenceInMinutes(addHours(addMinutes(startOfToday(), minutes), hours), startOfToday()) + 60
                    })
                  }}
                />
                <Input type="text"
                  as={PatternFormat}
                  format={"##:##"}
                  value={format(addMinutes(startOfToday(), lunchTime[1] || 0), "HH:mm")}
                  isAllowed={(values: any) => {
                    const { formattedValue } = values;
                    const hours = parseInt(formattedValue.substr(0, 2));
                    const minutes = parseInt(formattedValue.substr(3, 2));
                    if (hours > 23 || minutes > 59) {
                      return false;
                    }
                    return true;
                  }}
                  onBlur={(e) => {
                    const hours = parseInt(e.target.value.substr(0, 2));
                    const minutes = parseInt(e.target.value.substr(3, 2));
                    setLunchTime({
                      start: lunchTime[0] ?? differenceInMinutes(addHours(addMinutes(startOfToday(), minutes), hours), startOfToday()) - 60,
                      end: differenceInMinutes(addHours(addMinutes(startOfToday(), minutes), hours), startOfToday())
                    })
                  }}
                />
              </HStack>
              <span>Dias de funcionamento</span>
              <HStack>
                <Checkbox isChecked={!inactiveDays.includes(0)} onChange={() => toggleDayIsActive(0)} >Domingo</Checkbox>
                <Checkbox isChecked={!inactiveDays.includes(1)} onChange={() => toggleDayIsActive(1)}>Segunda</Checkbox>
                <Checkbox isChecked={!inactiveDays.includes(2)} onChange={() => toggleDayIsActive(2)}>Terça</Checkbox>
                <Checkbox isChecked={!inactiveDays.includes(3)} onChange={() => toggleDayIsActive(3)}>Quarta</Checkbox>
                <Checkbox isChecked={!inactiveDays.includes(4)} onChange={() => toggleDayIsActive(4)}>Quinta</Checkbox>
                <Checkbox isChecked={!inactiveDays.includes(5)} onChange={() => toggleDayIsActive(5)}>Sexta</Checkbox>
                <Checkbox isChecked={!inactiveDays.includes(6)} onChange={() => toggleDayIsActive(6)}>Sábado</Checkbox>
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