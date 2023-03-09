import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdAdd, MdCheck } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { APPOINTMENT_QUERY_KEY, updateAppointmentFn } from '../../../../services/api/appointments';
import { AppointmentRaw } from '../../../../services/api/appointments/types';
import { RichTextContent, RichText } from './components/RichText';

export type MedicalRecordEditProps = {
  appointment: AppointmentRaw;
};

const MedicalRecordEdit: React.FC<MedicalRecordEditProps> = ({ appointment }) => {
  const ParsedRichTextArr = JSON.parse(appointment.medicalRecord) as RichTextContent[];
  const [richTextArr, setRichTextArr] = React.useState<RichTextContent[]>(ParsedRichTextArr || []);

  const queryClient = useQueryClient();

  const setRichTextContent = (index: number, content: RichTextContent) => {
    const newRichTextArr = [...richTextArr];
    newRichTextArr[index] = content;
    setRichTextArr(newRichTextArr);
  };

  const addNewRichTextContent = () => {
    setRichTextArr([...richTextArr, { title: '', content: '' }]);
  };

  const removeRichTextContent = (index: number) => {
    const newRichTextArr = [...richTextArr];
    newRichTextArr.splice(index, 1);
    setRichTextArr(newRichTextArr);
  };

  const handleSave = async () => {
    const StringifiedRichTextArr = JSON.stringify(richTextArr);
    await updateAppointmentFn({ appointmentId: appointment.id, medicalRecord: StringifiedRichTextArr });
    queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY);
    toast.success('Prontuário salvo com sucesso!');
  };

  return (
    <Flex w={"full"} direction={"column"} align={"flex-end"} p={"8px"}>
      <Flex w={"full"} justify={"space-between"} align={"center"} mb={"8px"}>
        <Flex align={"center"}>
          <Button
            bg={"white"}
            className="px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10"
            onClick={handleSave}>
            Salvar
            <Icon as={MdCheck} ml={"8px"} />
          </Button>
          <Text className="text-sm text-gray-900/50" ml={"8px"}>
            {appointment.medicalRecord === JSON.stringify(richTextArr) ? 'Sem alterações' : 'Alterações não salvas'}
          </Text>
        </Flex>
        <Button
          bg={"white"}
          className="px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10"
          onClick={addNewRichTextContent}
        >
          <Icon as={MdAdd} />
        </Button>
      </Flex>

      {richTextArr.map((b, i) => (
        <RichText
          key={i}
          richTextContent={b}
          setRichTextContent={(content) => setRichTextContent(i, content)}
          removeRichTextContent={() => removeRichTextContent(i)}
        />
      ))}
    </Flex>
  )
}

export default MedicalRecordEdit;