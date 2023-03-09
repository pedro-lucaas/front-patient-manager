import { createContext } from 'react';
import { IAuthContext, IAuthProvider, IUser, UpdateProfileBody } from './types';
import { getProfileRequest, loginRequest, updateProfileRequest } from './service';
import { TOKEN_STORAGE_KEY } from '../../services/api';
import { useNavigate } from 'react-router';
import routes from '../../routes/routes';
import { useQuery } from 'react-query';

export const USER_QUERY_KEY = 'user'

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const navigate = useNavigate()
  const isLogged = !!localStorage.getItem(TOKEN_STORAGE_KEY);
  let user: IUser | undefined = undefined
  const { data, refetch } = useQuery(USER_QUERY_KEY, () => getProfileRequest(), {
    enabled: isLogged
  })
  if (data) {
    user = {
      id: data?.id,
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      inactiveDays: data?.inactiveDays && JSON.parse(data?.inactiveDays) || [],
      workTime: data?.workTime && JSON.parse(data?.workTime) || [],
      lunchTime: data?.lunchTime && JSON.parse(data?.lunchTime) || [],
    }
  }

  const login = async (email: string, password: string) => {
    await loginRequest(email, password)
    navigate(routes.HOME)
  }

  const logout = async () => {
    navigate(routes.LOGIN)
  }

  const updateProfile = async (data: UpdateProfileBody) => {
    if (!user) return
    await updateProfileRequest({
      name: data.name ?? user.name,
      phone: data.phone ?? user.phone,
      inactiveDays: data.inactiveDays ?? JSON.stringify(user.inactiveDays),
      workTime: data.workTime ?? JSON.stringify(user.workTime),
      lunchTime: data.lunchTime ?? JSON.stringify(user.lunchTime),
    })
    refetch()
  }

  return (
    <AuthContext.Provider value={{ user, updateProfile, isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}