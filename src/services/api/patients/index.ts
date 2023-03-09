import { Api } from "..";
import { Pagination } from "../../../helpers/Pagination";
import { RawToAppointment } from "../appointments/mapper";
import { Appointment, AppointmentRaw, AppointmentStatus } from "../appointments/types";
import { endpoints } from "../endpoints";
import { Patient, PatientFormType } from "./types";

export const PATIENT_QUERY_KEY = 'patients';

export async function listPatientsFn(params?: any) {
  const res = await Api.get<Pagination<Patient>>(endpoints.PATIENTS, { params })
  return res.data;
}

export async function findPatientFn({ id }: { id?: string }) {
  if (!id) return;
  const res = await Api.get<Patient | undefined>(endpoints.PATIENT.replace(':id', id))
  return res.data;
}

export async function createPatientFn(patient: PatientFormType) {
  const res = await Api.post<Patient>(endpoints.PATIENT.replace(':id', ''), { ...patient, id: undefined })
  return res.data;
}

export async function updatePatientFn(patient: PatientFormType) {
  if (!patient.id) return undefined;
  const res = await Api.patch<Patient>(endpoints.PATIENT.replace(':id', patient.id), { ...patient, id: undefined })
  return res.data;
}

export async function listPatientAppointmentsFn({ id, page = 1, limit = 3, status }: { id: string, page?: number, limit?: number, status?: AppointmentStatus }): Promise<Pagination<Appointment>> {
  const res = await Api.get<Pagination<AppointmentRaw>>(endpoints.PATIENT_APPOINTMENTS.replace(':id', id), { params: { page, limit, status } })
  return {
    ...res.data,
    items: res.data.items.map((appointment) => {
      return RawToAppointment(appointment)
    })
  }
}