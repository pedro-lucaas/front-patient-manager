import { FormControl, FormLabel, Input, FormErrorMessage, Button, FormControlProps, Text, HStack, Box, Spinner, Radio, RadioGroup } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import redirects from '../../routes/routes';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat, PatternFormat } from 'react-number-format'
import { useQueryClient, useQueries } from 'react-query';
import { format } from 'date-fns'
import { useState } from 'react';
import { PATIENT_QUERY_KEY, listPatientsFn, findPatientFn } from '../../services/api/patients';
import { Patient } from '../../services/api/patients/types';
import { APPOINTMENT_QUERY_KEY } from '../../services/api/appointments';
import { AppointmentFormik } from '../../formik/appointment/AppointmentFormik';
import { AppointmentFormType } from '../../services/api/appointments/types';

export const formControlProps: FormControlProps = {
  mb: "40px",
};

export type AppointmentFormProps = {
  values?: AppointmentFormType,
  onClose: () => void;
}

const AppointmentForm = ({ values, onClose }: AppointmentFormProps) => {
  const [search, setSearch] = useState<string>('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const initialValues: AppointmentFormType = {
    appointmentId: values?.appointmentId || '',
    patientId: values?.patientId || '',
    date: values?.date && new Date(values?.date) || '',
    initTime: values?.initTime || '',
    endTime: values?.endTime || '',
    procedure: values?.procedure || '',
    price: values?.price || 0,
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

  function isAlloweded(values: any) {
    const { formattedValue } = values;
    const hours = parseInt(formattedValue.split(':')[0]) || 0;
    const minutes = parseInt(formattedValue.split(':')[1]) || 0;
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }
  const formik = AppointmentFormik({
    initialValues,
    onSuccessAction: () => {
      navigate(redirects.SCHEDULE)
      onClose();
      queryClient.invalidateQueries(APPOINTMENT_QUERY_KEY)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} style={{ textAlign: "left", display: "contents", justifyContent: "center", alignItems: "center" }}>
      <FormControl {...formControlProps} position={"relative"} isInvalid={!!formik.errors.patientId && !!formik.touched.patientId}>
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

      <FormControl {...formControlProps}>
        <RadioGroup id="procedure" name="procedure" value={formik.values.procedure}
          onChange={(value) => formik.setFieldValue("procedure", value)} >
          <Radio value="consulta">Consulta</Radio>
          <Radio value="retorno">Retorno</Radio>
        </RadioGroup>
      </FormControl>

      <FormControl {...formControlProps} isInvalid={!!formik.errors.date}>
        <FormLabel
          htmlFor="date"
          fontSize={["md", "16px"]}
          textTransform="capitalize"
        >
          {formik.values.procedure}
        </FormLabel>
        <HStack>
          <DatePicker
            id="date"
            name="date"
            value={formik.values.date ? format(new Date(formik.values.date), 'dd/MM/yyyy') : ""}
            onChange={(date: Date) => formik.setFieldValue('date', date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Data Inicial"
            customInput={<Input />}
          />
          <Input name="initTime" type="text" id="initTime" as={PatternFormat} isAllowed={isAlloweded} format="##:##" onChange={formik.handleChange} value={formik.values.initTime} />
          <Input name="endTime" type="text" id="initTime" as={PatternFormat} isAllowed={isAlloweded} format="##:##" onChange={formik.handleChange} value={formik.values.endTime} />
        </HStack>
        <Text color={"red"} fontSize={"sm"}>{formik.errors.date}</Text>
      </FormControl>

      <FormControl {...formControlProps} isInvalid={!!formik.errors.price && !!formik.touched.price}>
        <FormLabel
          htmlFor="price"
          fontSize={["md", "16px"]}
        >
          Valor
        </FormLabel>
        <Input name="price" type="text" id="price" as={NumericFormat} isAllowed={isAlloweded} prefix="R$ "
          defaultValue={formik.values.price}
          decimalSeparator=','
          decimalScale={2}
          thousandSeparator="."
          onValueChange={(values: any) => {
            const { floatValue } = values;
            formik.setFieldValue('price', floatValue)
          }} />
        <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
      </FormControl>

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