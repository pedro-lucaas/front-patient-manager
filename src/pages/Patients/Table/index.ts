import { TableColumn } from 'react-data-table-component';
import { Pagination } from '../../../helpers/Pagination';

export { default as Table } from './Table';

export type ITableProps<T> = {
  search?: true;
  queryKey: string;
  columns: TableColumn<T>[];
  queryFn: (params?: any) => Promise<Pagination<T>>;
  filters?: ITableFilters;
  isLoaded?: boolean;
}

export type ITableFilters = {
  [key: string]: {
    value: string;
    label: string;
    options: {
      value: string;
      label: string;
      selected?: boolean;
    }[];
  };
}