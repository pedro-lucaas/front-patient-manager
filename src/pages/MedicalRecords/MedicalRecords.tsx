import { VStack } from '@chakra-ui/react';
import { columns } from './constants';
import { PATIENT_QUERY_KEY, listPatientsFn } from '../../services/api/patients';
import { ITableFilters, Table } from '../../components/Table';

const makeFilters = () => {
  const filters: ITableFilters = {
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

const MedicalRecords: React.FC = () => {
  const filters = makeFilters();
  return (
    <VStack spacing={4} w="full" mt={"50px"} className="container">
      <h1 className="w-full text-2xl text-gray-900">Prontuários</h1>
      <Table
        columns={columns}
        search={true}
        queryKey={PATIENT_QUERY_KEY}
        queryFn={listPatientsFn}
        filters={filters} />
    </VStack >
  );

}

export default MedicalRecords;