import { Pagination } from "../../helpers/Pagination";
import { Api, apiEndpoints } from "../../services/api";
import { Patient, PatientFormType } from "./types";

export const PATIENT_QUERY_KEY = 'patients';

export async function listPatientsFn(params?: any) {
  const res = await Api.get<Pagination<Patient>>(apiEndpoints.PATIENTS, { params })
  return res.data;
}

export async function findPatientFn({ id }: { id: string }) {
  if (!id) return undefined;
  const res = await Api.get<Patient | undefined>(apiEndpoints.PATIENT.replace(':id', id))
  return res.data;
}

export async function createPatientFn(patient: PatientFormType) {
  const res = await Api.post<Patient>(apiEndpoints.PATIENT.replace(':id', ''), { ...patient, id: undefined })
  return res.data;
}

export async function updatePatientFn(patient: PatientFormType) {
  if (!patient.id) return undefined;
  const res = await Api.patch<Patient>(apiEndpoints.PATIENT.replace(':id', patient.id), { ...patient, id: undefined })
  return res.data;
}

export async function listPatientAppointmentsFn({ id, page }: { id: string, page: number }) {
  if (!id) return undefined;
  const res = await Api.get<Patient | undefined>(apiEndpoints.PATIENT.replace(':id', id) + apiEndpoints.APPOINTMENTS, { params: { page, limit: 3 } })
  return res.data;
}

export async function startAppointmentFn({ id }: { id: string }) {
  if (!id) return undefined;
  const res = await Api.put<Patient | undefined>(apiEndpoints.START_APPOINTMENT.replace(':id', id))
  return res.data;
}
export async function finishAppointmentFn({ id }: { id: string }) {
  if (!id) return undefined;
  const res = await Api.put<Patient | undefined>(apiEndpoints.FINISH_APPOINTMENT.replace(':id', id))
  return res.data;
}