import { Heading, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { IAttribute } from '../../context/ConfigProvider/types';
import { useConfig } from '../../context/ConfigProvider/useConfig';
import { columns } from './constants';
import { listPatientsFn, PATIENT_QUERY_KEY } from './service';
import { ITableFilters, Table } from './Table';

const makeFilters = (attributes: IAttribute[]) => {
  const filters: ITableFilters = {
    attribute: {
      value: 'attribute',
      label: 'Atributo',
      options: [
        ...attributes?.map((attribute) => ({
          value: attribute.name,
          label: attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1).toLowerCase(),
        })) || [],
      ],
    },
    sex: {
      value: "sex",
      label: "Sexo",
      options: [
        {
          value: "M",
          label: "Masculino",
        },
        {
          value: "F",
          label: "Feminino",
        },
      ],
    }
  }
  return filters;
}

const ListPatients: React.FC = () => {
  const { attributes } = useConfig();
  const [filters, setFilters] = React.useState<ITableFilters>(makeFilters(attributes || []));

  useEffect(() => {
    if (!attributes) return
    setFilters(makeFilters(attributes))
  }, [attributes, makeFilters])

  if (!attributes) return null;
  return (
    <VStack spacing={4} w="full" mt={"50px"} className="container">
      <h1 className="w-full text-2xl text-gray-900">Pacientes</h1>
      <Table
        columns={columns}
        search={true}
        queryKey={PATIENT_QUERY_KEY}
        queryFn={listPatientsFn}
        filters={filters} />
    </VStack >
  );

}

export default ListPatients;