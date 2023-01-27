import { createContext } from 'react';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { Pagination } from '../../helpers/Pagination';
import usePersistedState from '../../utils/usePersistedState';
import { listAttibutesFn, createAttributeFn, deleteAttributeFn } from './services';
import { IConfigContext, IConfigProvider, IAttribute, intervalInt, InativeDays } from './types';

export const ATTRIBUTES_STORAGE_KEY = 'config';

export const ConfigContext = createContext<IConfigContext>({} as IConfigContext);

export const ConfigProvider = ({ children }: IConfigProvider) => {
  const [inativeDays, setInativeDays] = usePersistedState<InativeDays>("inativeDays", {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: true,
    sunday: true
  })
  const [lunchTime, setLunchTime] = usePersistedState<intervalInt | undefined>("lunchTime", {
    start: 60,
    end: 150
  });
  const [workingTime, setWorkingTime] = usePersistedState<intervalInt>("workingTime", {
    start: 0,
    end: 24
  });
  const { data, refetch } = useQuery<Pagination<IAttribute>, Error>(ATTRIBUTES_STORAGE_KEY,
    () => listAttibutesFn());

  const attributes = data?.items || [];
  const { mutate: mutationCreate } = useMutation(createAttributeFn, {
    onSuccess: () => {
      toast.success('Attribute created');
      refetch();
    },
    onError: (e: any) => {
      toast.error(e.response.data.message);
      refetch();
    }
  });
  const createAttribute = async (name: string, tag: string) => mutationCreate({ name, tag });

  const { mutate: mutationDelete } = useMutation(deleteAttributeFn, {
    onSuccess: () => {
      toast.success('Attribute deleted');
      refetch();
    },
    onError: (e: any) => {
      toast.error(e.response.data.message);
      refetch();
    }
  });
  const deleteAttribute = async (name: string) => mutationDelete(name);

  return (
    <ConfigContext.Provider value={{
      attributes,
      createAttribute,
      deleteAttribute,
      inativeDays,
      setInativeDays,
      lunchTime,
      setLunchTime,
      workingTime,
      setWorkingTime
    }}>
      {!!attributes && children}
    </ConfigContext.Provider>
  );
};