export type AppointmentFile = {
  id: string;
  fileName: string;
  fileUrl: string;
}

export type AppointmentRaw = {
  id: string;
  userId: number;
  patient: {
    id: string;
    name: string;
    email: string;
    sex: string;
    phone: string;
    birthDate: string;
  };
  initDate: string;
  endDate: string;
  status: string;
  procedure: string;
  price: number;
  confirmedBy?: string;
  paid: boolean;
  comments: string;
  medicalRecord: string;
  files: AppointmentFile[];
  cancelReason: string;
  createdAt: string;
  updatedAt: string;
}
export type Appointment = {
  id: string;
  userId: number;
  patient: {
    id: string;
    name: string;
    email: string;
    sex: string;
    phone: string;
    birthDate: Date;
  };
  initDate: Date;
  endDate: Date;
  status: AppointmentStatus;
  procedure: string;
  price: number;
  confirmedBy?: ConfirmedBy;
  paid: boolean;
  comments: string;
  medicalRecord: string;
  files: AppointmentFile[];
  cancelReason: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentBody = {
  appointmentId?: string;
  patientId: string;
  initDate: string;
  endDate: string;
  procedure: string;
  price: number;
}

export type AppointmentFormType = {
  appointmentId?: string;
  patientId: string;
  date: Date | string;
  initTime: string;
  endTime: string;
  procedure: string;
  price: number;
  file?: File;
}

export type UpdateAppointmentBody = {
  appointmentId: string;
  patientId?: string;
  initDate?: string;
  endDate?: string;
  procedure?: string;
  price?: number;
  paid?: boolean;
  confirmedBy?: ConfirmedBy;
  medicalRecord?: string;
  status?: AppointmentStatus;
}

export enum AppointmentStatusEnum {
  scheduled = 'scheduled',
  started = 'started',
  finished = 'finished',
  canceled = 'canceled',
}
export type AppointmentStatus = keyof typeof AppointmentStatusEnum;

export enum ConfirmedByEnum {
  WHATSAPP = 'WHATSAPP',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}
export type ConfirmedBy = keyof typeof ConfirmedByEnum;

export type ListAppointmentsParams = {
  status?: AppointmentStatus;
  initDate?: string;
  endDate?: string;
}
