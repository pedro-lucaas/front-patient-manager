export interface IUser {
  name: string;
  email: string;
  phone: string;
  token: string;
}

export interface IAuthContext {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface IAuthProvider {
  children: JSX.Element;
}