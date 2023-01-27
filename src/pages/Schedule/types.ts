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
    sex: string;
    phone: string;
    birthDate: string;
  };
  initDate: string;
  endDate: string;
  status: string;
  procedure: string;
  price: number;
  paid: boolean;
  comments: string;
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
    sex: string;
    phone: string;
    birthDate: Date;
  };
  initDate: Date;
  endDate: Date;
  status: AppointmentStatus;
  procedure: string;
  price: number;
  paid: boolean;
  comments: string;
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
export type UpdateAppointmentBody = {
  appointmentId: string;
  patientId?: string;
  initDate?: string;
  endDate?: string;
  procedure?: string;
  price?: number;
  paid?: boolean;
}

export enum AppointmentStatusEnum {
  scheduled = 'scheduled',
  started = 'started',
  finished = 'finished',
  canceled = 'canceled',
}

export type AppointmentStatus = keyof typeof AppointmentStatusEnum;
