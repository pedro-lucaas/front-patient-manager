import { Formik, Form, Field, FormikHelpers } from 'formik';
import { FormControl, FormLabel, Input, FormErrorMessage, Button, FormControlProps, InputProps, HStack, Box, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import redirects from '../../routes/routes';
import { APPOINTMENT_QUERY_KEY, createAppointment } from './service';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { NumericFormat, PatternFormat } from 'react-number-format'
import { useConfig } from '../../context/ConfigProvider/useConfig';
import { useQueryClient, useQuery } from 'react-query';
import { isBefore, setHours, setMinutes } from 'date-fns'
import { useState } from 'react';
import { listPatientsFn, PATIENT_QUERY_KEY } from '../Patients/service';
import { Pagination } from '../../helpers/Pagination';
import { Patient } from '../Patients/types';

export const formControlProps: FormControlProps = {
  display: "flex",
  mb: "40px",
};
export const inputProps: InputProps = {
  bgColor: "gray.300",
  color: "gray.900",
  _focus: { outline: 0 },
  _hover: { outline: 0, boxShadow: "lg" },
  fontSize: ["small", "sm", "md"],
};

export type AppointmentFormType = {
  patientId: string;
  date: Date | string;
  initTime: string;
  endTime: string;
  procedure: string;
  price: number;
  file?: File;
}

export type AppointmentFormProps = {
  values?: AppointmentFormType
}

const AppointmentForm = ({ values }: AppointmentFormProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const initialValues = {
    patientId: values?.patientId || "",
    date: values?.date && new Date(values?.date) || '',
    initTime: values?.initTime || '',
    endTime: values?.endTime || '',
    procedure: values?.procedure || '',
    price: values?.price || '',
    priceFloat: values?.price || 0,
  }

  const [search, setSearch] = useState<string>('')
  const {
    data,
    isLoading,
  } = useQuery<Pagination<any>, Error>([PATIENT_QUERY_KEY, search], () => listPatientsFn({ search }));
  const onSubmit = async (values: typeof initialValues, actions: FormikHelpers<typeof initialValues>) => {
    try {
      await createAppointment({
        patientId: values.patientId,
        procedure: values.procedure,
        price: values.priceFloat,
        initDate: setHours(setMinutes(new Date(values.date), parseInt(values.initTime.split(":")[1])), parseInt(values.initTime.split(":")[0])).toISOString(),
        endDate: setHours(setMinutes(new Date(values.date), parseInt(values.endTime.split(":")[1])), parseInt(values.endTime.split(":")[0])).toISOString(),
      })
      navigate(redirects.SCHEDULE)
      toast.success('Agendamento salvo com sucesso!')
    } catch (e: any) {
      console.error(e)
      toast.error(e.message)
    }
    queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY)
  }

  function isAlloweded(values: any) {
    const { formattedValue } = values;
    const hours = parseInt(formattedValue.split(':')[0]) || 0;
    const minutes = parseInt(formattedValue.split(':')[1]) || 0;
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      initialErrors={{}}
      validate={(values) => {
        const errors: any = {};
        if (!values.patientId) {
          errors.patientId = 'Campo obrigatório';
        }
        if (isBefore(new Date(values?.date), new Date())) {
          errors.date = 'Data inválida';
        }
        return errors;
      }}
    >
      {(props) => (
        <Form style={{ textAlign: "left", display: "contents", justifyContent: "center", alignItems: "center" }}>
          <Field name="patientId">
            {({ field, form }: any) => (
              <FormControl {...formControlProps} position={"relative"} flexDir="column" placeholder="patientId" isInvalid={form.errors.patientId && form.touched.patientId} {...formControlProps}>
                <FormLabel
                  htmlFor="patientId"
                  fontSize={["md", "16px"]}
                >
                  Nome
                </FormLabel>
                <Input {...inputProps} {...field} type="text" id="patientId" value={search} onChange={(e) => {
                  form.setFieldValue('patientId', '')
                  setSearch(e.target.value)
                }} />
                {search.length > 2 && !field.value && (
                  <Box paddingY={"10px"} overflowY={"scroll"} zIndex={1} position="absolute" top="0" right="0" bottom="0" left="0" bg="gray.200" height={"300%"} transform={"translateY(34%)"} shadow={"md"}>
                    {isLoading && <Spinner />}
                    {data && data.items.map((item: Patient) => (
                      <Box
                        key={item.id}
                        _hover={{ bg: "gray.300" }}
                        cursor={"pointer"}
                        paddingX={"10px"}
                        paddingY={"5px"}
                        onClick={() => {
                          form.setFieldValue('patientId', item.id)
                          setSearch(item.name)
                        }}>
                        {item.name}
                      </Box>
                    ))}
                  </Box>
                )}
                {search.length <= 2 && (<FormErrorMessage>{form.errors.patientId}</FormErrorMessage>)}

              </FormControl>
            )}
          </Field>
          <HStack {...formControlProps}>
            <Field name="date">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.date && form.touched.date}>
                  <DatePicker
                    id="date"
                    name="date"
                    selected={field.value ? field.value : null}
                    onChange={(date: Date) => form.setFieldValue('date', date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Data Inicial"
                    customInput={
                      <Input
                        {...inputProps}
                        {...field}
                      />
                    }
                  />
                  <FormErrorMessage>{form.errors.date}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="initTime">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.initTime && form.touched.initTime}>
                  <PatternFormat {...inputProps} {...field}
                    format="##:##"
                    customInput={Input}
                    isAllowed={isAlloweded}
                  />
                  <FormErrorMessage>{form.errors.initTime}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="endTime">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.endTime && form.touched.endTime}>
                  <PatternFormat {...inputProps} {...field}
                    format="##:##"
                    customInput={Input}
                    isAllowed={isAlloweded}
                  />
                  <FormErrorMessage>{form.errors.endTime}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </HStack>
          <Field name="price">
            {({ field, form }: any) => (
              <FormControl isInvalid={form.errors.price && form.touched.price}>
                <FormLabel
                  htmlFor="price"
                  fontSize={["md", "16px"]}
                >
                  Valor
                </FormLabel>
                <NumericFormat {...inputProps} {...field}
                  prefix="R$ "
                  decimalSeparator=','
                  decimalScale={2}
                  id="price"
                  allowLeadingZeros
                  thousandSeparator="."
                  inputMode="numeric"
                  customInput={Input}
                  onValueChange={(values) => {
                    const { value } = values;
                    form.setFieldValue('priceFloat', value)
                  }}
                />
                <FormErrorMessage>{form.errors.price}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <FormControl {...formControlProps}>
            <FormLabel>
              <Field type="radio" name="procedure" value="consulta" />
              Consulta
            </FormLabel>
            <FormLabel>
              <Field type="radio" name="procedure" value="retorno" />
              Retorno
            </FormLabel>
          </FormControl>

          <Button
            type="submit"
            colorScheme="telegram"
            mt={4}
            isLoading={props.isSubmitting}
            disabled={props.isSubmitting || !props.isValid}
            loadingText="Sign in..."
          >
            Salvar
          </Button>

        </Form>
      )}
    </Formik >
  );

}
export default AppointmentForm;