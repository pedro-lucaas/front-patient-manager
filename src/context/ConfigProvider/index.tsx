import React, { createContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Pagination } from '../../helpers/Pagination';
import usePersistedState from '../../utils/usePersistedState';
import { listAttibutesFn, createAttributeFn, deleteAttributeFn } from './services';
import { IConfigContext, IConfigProvider, IAttribute } from './types';

export const ATTRIBUTES_STORAGE_KEY = 'config';

export const ConfigContext = createContext<IConfigContext>({} as IConfigContext);

export const ConfigProvider = ({ children }: IConfigProvider) => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery<Pagination<IAttribute>, Error>(ATTRIBUTES_STORAGE_KEY,
    () => listAttibutesFn());

  const attributes = data?.items || [];
  const { mutate: mutationCreate } = useMutation(createAttributeFn, {
    onSuccess: () => {
      toast.success('Attribute created');
      refetch();
    },
    onError: (e: any) => {
      toast.error(e.message);
      refetch();
    }
  });
  const createAttribute = async (name: string, tag: string) => mutationCreate({ name, tag });

  const { mutate: mutationDelete, isLoading } = useMutation(deleteAttributeFn, {
    onSuccess: () => {
      toast.success('Attribute deleted');
      refetch();
    },
    onError: (e: any) => {
      toast.error(e.message);
      refetch();
    }
  });
  const deleteAttribute = async (name: string) => mutationDelete(name);

  return (
    <ConfigContext.Provider value={{ attributes, createAttribute, deleteAttribute }}>
      {!!attributes && children}
    </ConfigContext.Provider>
  );
};