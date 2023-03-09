export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  token?: string;
  inactiveDays: number[];
  lunchTime: number[];
  workTime: number[];
}

export interface IAuthContext {
  isLogged: boolean;
  user: IUser | undefined;
  updateProfile: (data: UpdateProfileBody) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface IAuthProvider {
  children: JSX.Element;
}

export type UpdateProfileBody = {
  name?: string;
  phone?: string;
  inactiveDays?: string;
  lunchTime?: string;
  workTime?: string;
}