import { Appointment, AppointmentRaw, AppointmentStatusEnum, ConfirmedByEnum } from "./types";

export function RawToAppointment(raw: AppointmentRaw): Appointment {
  return {
    ...raw,
    initDate: new Date(raw.initDate),
    endDate: new Date(raw.endDate),
    status: AppointmentStatusEnum[raw.status as keyof typeof AppointmentStatusEnum],
    confirmedBy: ConfirmedByEnum[raw.confirmedBy as keyof typeof ConfirmedByEnum],
    patient: {
      ...raw.patient,
      birthDate: new Date(raw.patient.birthDate)
    }
  };
}