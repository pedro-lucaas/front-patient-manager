import { TableColumn } from "react-data-table-component";
import { differenceInSeconds } from "date-fns";
import { Box, Tooltip, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { Patient } from "../../services/api/patients/types";

function difference(dateLeft: Date, dateRight: Date) {
  const seconds = differenceInSeconds(dateLeft, dateRight);

  let string = "Há poucos segundos";
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30);
  let years = Math.floor(months / 12);

  if (minutes > 0) {
    string = `Há ${minutes} minuto`;
    if (minutes > 1) {
      string += "s";
    }
  }
  if (hours > 0) {
    string = `Há ${hours} hora`;
    if (hours > 1) {
      string += "s";
    }
  }
  if (days > 0) {
    string = `Há ${days} dia`;
    if (days > 1) {
      string += "s";
    }
  }
  if (months > 0) {
    string = `Há ${months} mês`;
    if (months > 1) {
      string += "es";
    }
  }
  if (years > 0) {
    string = `Há ${years} ano`;
    if (years > 1) {
      string += "s";
    }
  }

  return string
}

export const columns: TableColumn<Patient>[] = [
  {
    name: <Tooltip label="Última atualização">Última atualização</Tooltip>,
    cell: (row) => <Tooltip label="Última atualização"><Text>{difference(new Date(), new Date(row.updatedAt))}</Text></Tooltip>,
    minWidth: "50px",
    grow: .5,
  },
  {
    name: 'Nome',
    cell: (row) => <Name name={row.name} id={row.id} />,
  },
  {
    name: 'Email',
    selector: (row) => row.email ?? "",
  },
  {
    name: 'Telefone',
    selector: (row) => row.phone,
  },
  {
    name: 'Data de Nascimento',
    selector: (row) => new Date(row.birthDate).toLocaleDateString(),
  },
  {
    name: '',
    selector: (row) => row.sex,
  },
  {
    name: 'Criado em',
    selector: (row) => new Date(row.createdAt).toLocaleDateString(),
  }
];

const Name = ({ name, id }: { name: string, id: string }) => {
  const navigate = useNavigate();
  return (
    <Box
      color={"blue.500"}
      cursor={"pointer"}
      onClick={() => navigate(`/prontuarios/${id}`)}
      _hover={{
        textDecoration: "underline",
      }}
    >
      {name}
    </Box>
  );
};
