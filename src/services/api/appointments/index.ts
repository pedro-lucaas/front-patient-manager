import { Api } from "..";
import { Pagination } from "../../../helpers/Pagination";
import { endpoints } from "../endpoints";
import { RawToAppointment } from "./mapper";
import { ListAppointmentsParams, AppointmentRaw, AppointmentBody, UpdateAppointmentBody, Appointment } from "./types";

export const APPOINTMENT_QUERY_KEY = 'appointments';

export async function listAppointments(params: ListAppointmentsParams): Promise<Pagination<Appointment>> {
  const res = await Api.get<Pagination<AppointmentRaw>>(endpoints.APPOINTMENTS, { params })
  return {
    ...res.data,
    items: res.data.items.map((appointment) => {
      return RawToAppointment(appointment)
    })
  }
}

export async function uploadImagesFn(id: string, data: FormData) {
  const response = await Api.post(
    endpoints.APPOINTMENT_IMAGES.replace(":id", id),
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function deleteImageFn({ id, imageId }: { id: string, imageId: string }) {
  const res = await Api.delete(endpoints.APPOINTMENT_IMAGE.replace(':id', id).replace(':imageId', imageId))
  return res.data;
}

export async function getAppointment({ id }: { id: string | undefined | null }) {
  if (!id) return undefined;
  const res = await Api.get<AppointmentRaw>(endpoints.APPOINTMENT.replace(':id', id))
  return res.data;
}

export async function createAppointmentFn(params: AppointmentBody) {
  const res = await Api.post<AppointmentBody>(endpoints.APPOINTMENT.replace("/:id", ""), params);
  return res.data;
}

export async function updateAppointmentFn(params: UpdateAppointmentBody) {
  const res = await Api.put<AppointmentBody>(endpoints.APPOINTMENT.replace(":id", params.appointmentId), params);
  return res.data;
}
export async function deleteAppointmentFn({ id }: { id: string }) {
  if (!id) return undefined;
  const res = await Api.delete(endpoints.APPOINTMENT.replace(':id', id))
  return res.data;
}