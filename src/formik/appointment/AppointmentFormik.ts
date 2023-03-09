import { setSeconds, setHours, setMinutes, isBefore } from 'date-fns';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { updateAppointmentFn, createAppointmentFn } from '../../services/api/appointments';
import { AppointmentFormType } from '../../services/api/appointments/types';

export type AppointmentFormikProps = {
  initialValues: AppointmentFormType,
  onSuccessAction?: () => void,
}

export const AppointmentFormik = (props: AppointmentFormikProps) => {
  const { initialValues, onSuccessAction } = props;

  const onSubmit = async (values: AppointmentFormType) => {
    try {
      if (values.appointmentId) {
        await updateAppointmentFn({
          appointmentId: values.appointmentId,
          procedure: values.procedure,
          patientId: values.patientId,
          price: values.price,
          initDate: setSeconds(setHours(setMinutes(new Date(values.date), parseInt(values.initTime.split(":")[1])), parseInt(values.initTime.split(":")[0])), 1).toISOString(),
          endDate: setSeconds(setHours(setMinutes(new Date(values.date), parseInt(values.endTime.split(":")[1])), parseInt(values.endTime.split(":")[0])), 0).toISOString(),
        })
      } else {
        await createAppointmentFn({
          patientId: values.patientId,
          procedure: values.procedure,
          price: values.price,
          initDate: setSeconds(setHours(setMinutes(new Date(values.date), parseInt(values.initTime.split(":")[1])), parseInt(values.initTime.split(":")[0])), 1).toISOString(),
          endDate: setSeconds(setHours(setMinutes(new Date(values.date), parseInt(values.endTime.split(":")[1])), parseInt(values.endTime.split(":")[0])), 0).toISOString(),
        })
      }
      toast.success('Agendamento salvo com sucesso!')
      onSuccessAction && onSuccessAction();
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate: (values) => {
      const errors: Partial<typeof initialValues> = {};
      if (!values.patientId) {
        errors.patientId = 'Campo obrigatório';
      }
      const initTime = values.initTime.split(":")
      const initDate = setHours(setMinutes(new Date(values.date), parseInt(initTime[1])), parseInt(initTime[0]))
      if (isBefore(initDate, new Date())) {
        errors.date = 'Data não pode ser menor que a data atual';
      }
      const endTime = values.endTime.split(":")
      const endDate = setHours(setMinutes(new Date(values.date), parseInt(endTime[1])), parseInt(endTime[0]))
      if (isBefore(endDate, initDate)) {
        errors.date = 'Data final não pode ser menor que a data inicial';
      }
      return errors;
    },
  })

  return formik;
}
