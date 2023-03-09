import { VStack, Flex, Tooltip, Button, Icon, Input } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router';
import routes from '../../../../routes/routes';
import { Patient } from '../../../../services/api/patients/types';
import { AiFillEdit, AiFillSave } from 'react-icons/ai';
import { deleteAttributeFn, createAttributeFn } from '../../../../context/ConfigProvider/services';
import { toast } from 'react-toastify';

export type MedicalRecordHeaderProps = {
  patient: Patient;
}

const MedicalRecordHeader: React.FC<MedicalRecordHeaderProps> = ({ patient }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [attributes, setAttributes] = React.useState(patient.extraAttributes);

  const saveAttributes = async () => {
    const attributesToSave = attributes.filter((attribute) => patient.extraAttributes.find((attr) => attr.name === attribute.name)?.value !== attribute.value);
    const attributesToDelete = patient.extraAttributes.filter((attribute) => !attributes.find((attr) => attr.name === attribute.name));
    try {
      await Promise.all(attributesToSave.map((attribute) => createAttributeFn(patient.id, attribute)));
      await Promise.all(attributesToDelete.map((attribute) => deleteAttributeFn(patient.id, attribute.name)));
      toast.success("Cabeçalho salvo com sucesso!");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  const addAttribute = (name: string, value: string) => {
    setAttributes([...attributes, { name, value }]);
  }

  const updateAttribute = (index: number, name: string, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { name, value };
    setAttributes(newAttributes);
  }

  const deleteAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  }

  const toggleIsEditing = () => {
    if (isEditing) {
      saveAttributes();
    }
    setIsEditing(!isEditing);
  };

  const navigate = useNavigate();
  return <VStack spacing={4} w="full" mt={"50px"} pr={"15px"}>
    <h1 className="w-full text-2xl text-gray-900">{patient.name}</h1>
    <div className="px-6 py-4 bg-white rounded shadow-md ring-1 ring-gray-900/10">
      <Flex className="flex justify-between">
        <h1 className="w-full text-xl text-gray-900">Dados Pessoais</h1>
        {!isEditing ? <Tooltip label={"Editar Cabeçalho"}>
          <Button colorScheme="transparent" size="sm" onClick={toggleIsEditing}><Icon as={AiFillEdit} color={"black"} boxSize={"20px"} /></Button>
        </Tooltip> :
          <Tooltip label={"Salvar"}>
            <Button colorScheme="transparent" size="sm" onClick={toggleIsEditing}><Icon as={AiFillSave} color={"black"} boxSize={"20px"} /></Button>
          </Tooltip>}
      </Flex>
      <p className="text-gray-700">Nome: {patient.name}</p>
      <p className="text-gray-700">CPF: {patient.cpf}</p>
      <p className="text-gray-700">Data de Nascimento: {patient.birthDate}</p>
      <p className="text-gray-700">Telefone: {patient.phone}</p>
      <p className="text-gray-700">Email: {patient.email}</p>
      {attributes.map((attr, index) => (
        <Flex key={index} >
          {isEditing ? <Input size={"xs"} placeholder="Nome" value={attr.name} onChange={(e) => updateAttribute(index, e.target.value, attr.value)} /> : <p className="text-gray-700">{attr.name}: </p>}
          {isEditing ? <Input size={"xs"} placeholder="Valor" value={attr.value} onChange={(e) => updateAttribute(index, attr.name, e.target.value)} /> : <p className="text-gray-700">{attr.value}</p>}
          {isEditing && <Button size={"xs"} colorScheme={"red"} onClick={() => deleteAttribute(index)}> - </Button>}
        </Flex>
      ))}
      <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={"20px"}>
        {isEditing && (
          <Flex>
            <form
              style={{ display: "flex", flexDirection: "row" }}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get("name") as string;
                const value = formData.get("value") as string;
                if (!name || !value) return;
                addAttribute(name, value);
                e.currentTarget.reset();
              }}
            >
              <Input name='name' size={"xs"} placeholder="Nome" />
              <Input name='value' size={"xs"} placeholder="Valor" />
              <Button size={"xs"} colorScheme={"green"} type="submit"> + </Button>
            </form>
          </Flex>
        )}
      </Flex>
      {!isEditing &&
        <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={"20px"}>
          <Button colorScheme="blue" size="sm" onClick={() => navigate(routes.PATIENT.replace(":id", patient.id))}>Ver Cadastro</Button>
        </Flex>
      }


    </div>
  </VStack >;
}

export default MedicalRecordHeader;