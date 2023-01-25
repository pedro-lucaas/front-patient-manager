export type Pagination<T> = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: T[];
}