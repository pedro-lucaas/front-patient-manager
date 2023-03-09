export type Patient = {
  id: string;
  name: string;
  cpf: string;
  caregiver?: string;
  email?: string;
  phone: string;
  phone2?: string;
  sex: string;
  civilStatus?: string;
  birthDate: string;
  schooling?: string;
  addressCep?: string;
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
  extraAttributes: {
    name: string;
    value: string;
  }[];
}

export type PatientFormType = {
  id?: string;
  name: string;
  cpf: string;
  caregiver?: string;
  email?: string;
  phone: string;
  phone2?: string;
  sex: string;
  civilStatus?: string;
  birthDate: Date | string;
  schooling?: string;
  addressCep?: string;
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  comments: string;
  [key: string]: any;
}