import { Pagination } from "../../helpers/Pagination";
import { Api, apiEndpoints } from "../../services/api";
import { AppointmentBody, AppointmentRaw, AppointmentStatus, UpdateAppointmentBody } from "./types";

export const APPOINTMENT_QUERY_KEY = 'appointments';

type ListAppointmentsParams = {
  status?: AppointmentStatus;
  initDate?: string;
  endDate?: string;
}

export async function listAppointments(params: ListAppointmentsParams) {
  const res = await Api.get<Pagination<AppointmentRaw>>(apiEndpoints.APPOINTMENTS, { params })
  return res.data;
}

export async function createAppointmentFn(params: AppointmentBody) {
  const res = await Api.post<AppointmentBody>(apiEndpoints.APPOINTMENT.replace("/:id", ""), params);
  return res.data;
}

export async function updateAppointmentFn(params: UpdateAppointmentBody) {
  const res = await Api.put<AppointmentBody>(apiEndpoints.APPOINTMENT.replace(":id", params.appointmentId), params);
  return res.data;
}
