import { Box, Flex, Spinner, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Api, apiEndpoints } from '../../../services/api';
import DataTable, { createTheme } from "react-data-table-component";
import { Pagination } from '../../../helpers/Pagination';
import { ITableFilters, ITableProps } from './index';
import { NavFilter } from './NavFilters';
import { Search } from './Search';


createTheme('customTheme', {
  divider: {
    default: 'transparent',
  },
  action: {
    button: 'rgba(0,0,0,.54)',
    hover: 'rgba(0,0,0,.08)',
    disabled: 'rgba(0,0,0,.12)',
  },
}, 'light');


const Table = (props: ITableProps<any>) => {
  const { queryFn, queryKey, columns, filters: initialFilters, search: useSearch } = props;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ITableFilters>(initialFilters ?? {});

  const transformedFilters = Object.entries(filters).reduce((acc, obj, i) => { return { ...acc, [obj[0]]: obj[1].options.find(option => option.selected)?.value ?? '' } }, {});

  const {
    data,
    isLoading,
  } = useQuery<Pagination<any>, Error>([queryKey, page, search, ...Object.values(transformedFilters)],
    () => queryFn({ page, search, ...transformedFilters }));
  return (
    <div className="w-full mt-10">
      <div className="wrapper w-full bg-white px-6 py-4 rounded shadow-md ring-1 ring-gray-900/10">
        <Flex flexDir={"column"}>
          {useSearch && <Search search={search} setSearch={setSearch} />}
          {filters && <NavFilter filters={filters} setFilters={setFilters} />}
        </Flex>
        <DataTable
          theme="customTheme"
          columns={columns}
          data={data?.items ?? []}
          pagination
          progressPending={isLoading}
          progressComponent={<Spinner />}
          paginationPerPage={10}
          paginationTotalRows={data?.total ?? 0}
          paginationComponentOptions={{
            noRowsPerPage: true,
          }}
          onChangePage={(page) => setPage(page)}
        />
      </div>
    </div >
  );;
}

export default Table;