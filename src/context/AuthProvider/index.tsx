import { createContext } from 'react';
import usePersistedState from '../../utils/usePersistedState';
import { IAuthContext, IAuthProvider, IUser } from './types';
import { loginRequest } from './service';

export const USER_STORAGE_KEY = '@user';

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = usePersistedState<IUser | null>(USER_STORAGE_KEY, null);

  const login = async (email: string, password: string) => {
    const response = await loginRequest(email, password)
    const { name, email: userEmail, phone, token } = response;
    setUser({
      name,
      email: userEmail,
      phone,
      token,
    });
  }

  const logout = async () => {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}