import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import redirects from '../../routes/routes';
import { PatientFormType } from './types';
import { createPatientFn, PATIENT_QUERY_KEY, updatePatientFn } from './service';
import { isDate } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';

export const PatientFormik = (initialValues: PatientFormType) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !initialValues.id;

  const onSubmit = async (values: typeof initialValues) => {
    try {
      if (!isNew) {
        await updatePatientFn({ ...values, birthDate: new Date(values.birthDate).toISOString() })
      } else {
        await createPatientFn({ ...values, birthDate: new Date(values.birthDate).toISOString() })
      }
      navigate(redirects.MEDICAL_RECORDS)
      toast.success('Paciente salvo com sucesso!')
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
    queryClient.invalidateQueries(PATIENT_QUERY_KEY)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate: (values) => {
      const errors: Partial<typeof initialValues> = {};
      if (!values.name) {
        errors.name = 'Nome é obrigatório';
      }
      if (!values.email) {
        errors.email = 'E-mail é obrigatório';
      }
      if (!values.phone) {
        errors.phone = 'Telefone é obrigatório';
      }
      if (!values.birthDate) {
        errors.birthDate = 'Data é obrigatório';
        if (!isDate(values.birthDate)) {
          errors.birthDate = 'Data inválida';
        }
      }
      if (!isDate(values.birthDate)) {
        errors.birthDate = 'Data inválida';
      }
      if (!values.cpf) {
        errors.cpf = 'CPF é obrigatório';
      }
      if (!values.sex) {
        errors.sex = 'Selecione uma opção';
      }
      return errors;
    }
  })
  return formik;
}
