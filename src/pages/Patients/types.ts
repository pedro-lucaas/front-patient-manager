export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  sex: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: boolean | string | undefined;
}

export type PatientFormType = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date | string;
  sex: string;
  comments: string;
  [key: string]: any;
}