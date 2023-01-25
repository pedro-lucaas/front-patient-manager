import { Pagination } from "../../helpers/Pagination";
import { Api, apiEndpoints } from "../../services/api";
import { AppointmentBody, AppointmentRaw } from "./types";

export const APPOINTMENT_QUERY_KEY = 'appointments';

type ListAppointmentsByIntervalParams = {
  initDate: string;
  endDate: string;
}

export async function listAppointmentsByInterval(params: ListAppointmentsByIntervalParams) {
  const res = await Api.get<Pagination<AppointmentRaw>>(apiEndpoints.APPOINTMENTS, { params })
  return res.data;
}

export async function createAppointment(params: AppointmentBody) {
  const res = await Api.post<AppointmentBody>(apiEndpoints.APPOINTMENT.replace("/:id", ""), params);
  return res.data;
}
