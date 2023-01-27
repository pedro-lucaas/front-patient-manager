import { useFormik } from 'formik';
import { FormControl, FormLabel, Input, FormErrorMessage, Button, FormControlProps, Text, HStack, Box, Spinner, Radio, RadioGroup } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import redirects from '../../routes/routes';
import { APPOINTMENT_QUERY_KEY, createAppointmentFn, updateAppointmentFn } from './service';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { NumericFormat, PatternFormat } from 'react-number-format'
import { useQueryClient, useQueries } from 'react-query';
import { isBefore, setHours, setMinutes, format, setSeconds } from 'date-fns'
import { useState } from 'react';
import { findPatientFn, listPatientsFn, PATIENT_QUERY_KEY } from '../Patients/service';
import { Patient } from '../Patients/types';

export const formControlGroupProps: FormControlProps = {
  display: "flex",
  mb: "40px",
};

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

export type AppointmentFormProps = {
  values?: AppointmentFormType,
  onClose: () => void;
}

const AppointmentForm = ({ values, onClose }: AppointmentFormProps) => {
  const [search, setSearch] = useState<string>('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const initialValues = {
    appointmentId: values?.appointmentId || '',
    patientId: values?.patientId || '',
    date: values?.date && new Date(values?.date) || '',
    initTime: values?.initTime || '',
    endTime: values?.endTime || '',
    procedure: values?.procedure || '',
    price: values?.price || '',
    priceFloat: values?.price || 0,
  }

  const [{ data: patients, isLoading: isLoadingPatients }, { data: patient }] = useQueries([
    {
      queryKey: [PATIENT_QUERY_KEY, search],
      queryFn: () => listPatientsFn({ search }),
      enabled: search.length > 2 && initialValues.patientId === '',
    },
    {
      queryKey: [PATIENT_QUERY_KEY, initialValues.patientId],
      queryFn: () => findPatientFn({ id: initialValues.patientId }),
      enabled: initialValues.patientId !== '',
    }
  ])

  const onSubmit = async (values: typeof initialValues) => {
    try {
      if (initialValues.patientId) {
        await updateAppointmentFn({
          appointmentId: values.appointmentId,
          procedure: values.procedure,
          patientId: values.patientId,
          price: values.priceFloat,
          initDate: setSeconds(setHours(setMinutes(new Date(values.date), parseInt(values.initTime.split(":")[1])), parseInt(values.initTime.split(":")[0])), 1).toISOString(),
          endDate: setSeconds(setHours(setMinutes(new Date(values.date), parseInt(values.endTime.split(":")[1])), parseInt(values.endTime.split(":")[0])), 0).toISOString(),
        })
      } else {
        await createAppointmentFn({
          patientId: values.patientId,
          procedure: values.procedure,
          price: values.priceFloat,
          initDate: setSeconds(setHours(setMinutes(new Date(values.date), parseInt(values.initTime.split(":")[1])), parseInt(values.initTime.split(":")[0])), 1).toISOString(),
          endDate: setSeconds(setHours(setMinutes(new Date(values.date), parseInt(values.endTime.split(":")[1])), parseInt(values.endTime.split(":")[0])), 0).toISOString(),
        })
      }
      navigate(redirects.SCHEDULE)
      toast.success('Agendamento salvo com sucesso!')
      onClose();
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
    queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY)
  }

  function isAlloweded(values: any) {
    const { formattedValue } = values;
    const hours = parseInt(formattedValue.split(':')[0]) || 0;
    const minutes = parseInt(formattedValue.split(':')[1]) || 0;
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    initialErrors: {},
    validate: (values) => {
      const errors: any = {};
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
  });


  return (

    <form onSubmit={formik.handleSubmit} style={{ textAlign: "left", display: "contents", justifyContent: "center", alignItems: "center" }}>
      <HStack {...formControlGroupProps}>

        <FormControl position={"relative"} flexDir="column" isInvalid={!!formik.errors.patientId && !!formik.touched.patientId}>
          <FormLabel
            htmlFor="patientId"
            fontSize={["md", "16px"]}
          >
            Paciente
          </FormLabel>
          <Input name="patientId" type="text" id="patientId" value={patient ? patient.name : search} disabled={!!patient} onChange={(e) => {
            formik.setFieldValue('patientId', '')
            setSearch(e.target.value)
          }} />
          {patients && !formik.values.patientId && (
            <Box paddingY={"10px"} overflowY={"scroll"} zIndex={1} position="absolute" top="0" right="0" bottom="0" left="0" bg="gray.200" height={"300%"} transform={"translateY(34%)"} shadow={"md"}>
              {isLoadingPatients && <Spinner />}
              {patients && patients.items.map((item: Patient) => (
                <Box
                  key={item.id}
                  _hover={{ bg: "gray.300" }}
                  cursor={"pointer"}
                  paddingX={"10px"}
                  paddingY={"5px"}
                  onClick={() => {
                    formik.setFieldValue('patientId', item.id)
                    setSearch(item.name)
                  }}>
                  {item.name}
                </Box>
              ))}
            </Box>
          )}
          {search.length <= 2 && (<FormErrorMessage>{formik.errors.patientId}</FormErrorMessage>)}
        </FormControl>
        <Text color={"red"} fontSize={"sm"}>{formik.errors.date}</Text>
      </HStack>
      <HStack {...formControlGroupProps}>
        <FormControl isInvalid={!!formik.errors.date}>
          <DatePicker
            id="date"
            name="date"
            value={formik.values.date ? format(new Date(formik.values.date), 'dd/MM/yyyy') : ""}
            onChange={(date: Date) => formik.setFieldValue('date', date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Data Inicial"
            customInput={<Input />}
          />
        </FormControl>
        <FormControl isInvalid={!!formik.errors.date}>
          <Input name="initTime" type="text" id="initTime" as={PatternFormat} isAllowed={isAlloweded} format="##:##" onChange={formik.handleChange} value={formik.values.initTime} />
        </FormControl>
        <FormControl isInvalid={!!formik.errors.date}>
          <Input name="endTime" type="text" id="initTime" as={PatternFormat} isAllowed={isAlloweded} format="##:##" onChange={formik.handleChange} value={formik.values.endTime} />
        </FormControl>
      </HStack>
      <HStack {...formControlGroupProps}>

        <FormControl isInvalid={!!formik.errors.price && !!formik.touched.price}>
          <FormLabel
            htmlFor="price"
            fontSize={["md", "16px"]}
          >
            Valor
          </FormLabel>
          <Input name="price" type="text" id="price" as={NumericFormat} isAllowed={isAlloweded} prefix="R$ "
            decimalSeparator=','
            decimalScale={2}
            allowLeadingZeros
            thousandSeparator="."
            inputMode="numeric"
            onChange={formik.handleChange}
            onValueChange={(values: any) => {
              const { floatValue } = values;
              formik.setFieldValue('priceFloat', floatValue)
            }} value={formik.values.price} />
          <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
        </FormControl>

      </HStack>
      <HStack {...formControlGroupProps}>
        <RadioGroup id="procedure" name="procedure" value={formik.values.procedure}
          onChange={(value) => formik.setFieldValue("procedure", value)} >
          <Radio value="consulta">Consulta</Radio>
          <Radio value="retorno">Retorno</Radio>
        </RadioGroup>
      </HStack>

      <Button
        type="submit"
        colorScheme="telegram"
        mt={4}
        isLoading={formik.isSubmitting}
        disabled={formik.isSubmitting || !formik.isValid}
        loadingText="Sign in..."
      >
        Salvar
      </Button>

    </form>
  );

}
export default AppointmentForm;