export type AppointmentFile = {
  id: number;
  fileName: string;
  fileUrl: string;
}

export type AppointmentRaw = {
  id: number;
  userId: number;
  patient: {
    id: number;
    name: string;
    sex: string;
    phone: string;
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
  id: number;
  userId: number;
  patient: {
    id: number;
    name: string;
    sex: string;
    phone: string;
  };
  initDate: Date;
  endDate: Date;
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

export type AppointmentBody = {
  patientId: string;
  initDate: string;
  endDate: string;
  procedure: string;
  price: number;
}