import { TableColumn } from "react-data-table-component";
import { Patient } from "./types";
import { differenceInSeconds } from "date-fns";
import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router";

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
    name: 'Última atualização',
    selector: (row) => difference(new Date(), new Date(row.updatedAt)),
  },
  {
    name: 'Nome',
    selector: (row) => row.name,
  },
  {
    name: 'Email',
    selector: (row) => row.email,
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
  },
  {
    name: '',
    cell: (row) => <EditAction row={row} />,
  },
];

const EditAction = ({ row, onRowUpdate }: any) => {
  const navigate = useNavigate();
  return (
    <Box
      cursor={"pointer"}
      onClick={() => navigate(`/patients/${row.id}`)}
    >
      mais...
    </Box>
  );
};
