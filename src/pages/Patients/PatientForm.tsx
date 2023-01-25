import { Formik, Form, Field, FormikHelpers } from 'formik';
import { FormControl, FormLabel, Input, FormErrorMessage, Button, Text, Textarea, FormControlProps, InputProps, HStack, Heading, Box, Flex, Divider, Checkbox, VStack, Icon } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import redirects from '../../routes/routes';
import { PatientFormType } from './types';
import { createPatientFn, PATIENT_QUERY_KEY, updatePatientFn } from './service';
import { isDate } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { PatternFormat } from 'react-number-format'
import { useState } from 'react';
import { useConfig } from '../../context/ConfigProvider/useConfig';
import { useQueryClient } from 'react-query';
import { FaEdit } from 'react-icons/fa';
export const formControlProps: FormControlProps = {
  display: "flex",
  alignItems: "center",
  mb: "40px",
};
export const inputProps: InputProps = {
  bgColor: "gray.300",
  color: "gray.900",
  _focus: { outline: 0 },
  _hover: { outline: 0, boxShadow: "lg" },
  fontSize: ["small", "sm", "md"],
};

export type PatientFormProps = {
  values?: PatientFormType
}

const PatientForm = ({ values }: PatientFormProps) => {
  const navigate = useNavigate()
  const { attributes } = useConfig()
  const queryClient = useQueryClient()

  const initialValues: PatientFormType = {
    id: values?.id || '',
    name: values?.name || '',
    email: values?.email || '',
    phone: values?.phone || '',
    sex: values?.sex || '',
    birthDate: values?.birthDate && new Date(values?.birthDate) || '',
    comments: values?.comments || '',
    ...attributes?.map((attribute) => ({ [attribute.name]: values && !!values[attribute.name] })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
  }

  const isNew = !values && !initialValues.id;
  const [editMode, setEditMode] = useState(isNew)

  const onCancel = () => {
    navigate(redirects.PATIENTS)
  }

  const onSubmit = async (values: typeof initialValues, actions: FormikHelpers<typeof initialValues>) => {
    try {
      if (!isNew) {
        await updatePatientFn({ ...values, birthDate: new Date(values.birthDate).toISOString() })
      } else {
        await createPatientFn({ ...values, birthDate: new Date(values.birthDate).toISOString() })
      }
      navigate(redirects.PATIENTS)
      toast.success('Paciente salvo com sucesso!')
    } catch (e: any) {
      console.log(e)
      toast.error(e.message)
    }
    queryClient.invalidateQueries(PATIENT_QUERY_KEY)
  }

  return (
    <Box>
      <Flex fontSize={"0.8em"} mb={"20px"} opacity={"0.5"}>
        / <Link to={redirects.PATIENTS}>patients</Link> / {!isNew ? values?.name : 'Novo paciente'}
        {!editMode && <Button
          ml={"auto"}
          size={"sm"}
          colorScheme={"yellow"}
          onClick={() => setEditMode(!editMode)}
        >
          <Icon as={FaEdit} />
        </Button>}
      </Flex>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        pb="30px"
        mb={"20px"}
        borderBottom={"1px solid"}
        borderColor={"gray.200"}
      >
        <p style={{ fontSize: "1.5em" }}>{!isNew ? values?.name : 'Novo paciente'}</p>
      </Flex>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        initialErrors={{}}
        validate={(values) => {
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
          return errors;
        }}
      >
        {(props) => (
          <Form style={{ textAlign: "left", display: "contents", justifyContent: "center", alignItems: "center" }}>
            <Field name="name">
              {({ field, form }: any) => (
                <FormControl placeholder="name" isInvalid={form.errors.name && form.touched.name} {...formControlProps}>
                  <FormLabel
                    htmlFor="name"
                    fontSize={["md", "16px"]}
                  >
                    Nome
                  </FormLabel>
                  <Input {...inputProps} {...field} type="name" id="name" disabled={!editMode} />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="email">
              {({ field, form }: any) => (
                <FormControl placeholder="Email" isInvalid={form.errors.email && form.touched.email} {...formControlProps}>
                  <FormLabel
                    htmlFor="email"
                    fontSize={["md", "16px"]}
                  >
                    E-mail
                  </FormLabel>
                  <Input {...inputProps} {...field} type="email" id="email" disabled={!editMode} />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <HStack {...formControlProps}>
              <Field name="phone">
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                    <FormLabel
                      htmlFor="phone"
                      fontSize={["md", "16px"]}
                    >
                      Telefone
                    </FormLabel>
                    <Input {...inputProps} {...field} type="phone" id="phone" as={PatternFormat} format="(##) #####-####" disabled={!editMode} />
                    <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="birthDate">
                {({ field, form }: any) => (
                  <FormControl>
                    <FormLabel
                      htmlFor="birthDate"
                      fontSize={["md", "16px"]}
                    >
                      Data de Nascimento
                    </FormLabel>
                    <DatePicker
                      id="birthDate"
                      name="birthDate"
                      selected={field.value ? field.value : null}
                      onChange={(date: Date) => form.setFieldValue('birthDate', date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Data de nascimento"
                      disabled={!editMode}
                      customInput={
                        <Input
                          {...inputProps}
                          {...field}
                        />
                      }
                    />
                  </FormControl>
                )}
              </Field>
            </HStack>

            <FormControl {...formControlProps}>
              <FormLabel>
                <Field type="radio" name="sex" value="M" disabled={!editMode} />
                Masculino
              </FormLabel>
              <FormLabel>
                <Field type="radio" name="sex" value="F" disabled={!editMode} />
                Feminino
              </FormLabel>
            </FormControl>

            <Field name="comments">
              {({ field, form }: any) => (
                <FormControl mb={"40px"} isInvalid={form.errors.comments && form.touched.comments}>
                  <FormLabel
                    htmlFor="comments"
                    fontSize={["md", "16px"]}
                  >
                    Observações
                  </FormLabel>
                  <Textarea {...inputProps} {...field} type="text" id="comments" disabled={!editMode} />
                  <FormErrorMessage>{form.errors.comments}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <HStack w={{ sm: "50%" }}>
              {attributes && attributes.map((attribute) => (
                <FormControl key={attribute.name} d={"flex"} alignItems={"center"} textTransform={"capitalize"}>
                  <Field name={attribute.name}>
                    {({ field, form }: any) => (
                      <Checkbox
                        {...inputProps}
                        {...field}
                        type="checkbox"
                        id={attribute.name}
                        disabled={!editMode}
                        onChange={() => {
                          form.setFieldValue(attribute.name, !form.values[attribute.name]);
                        }}
                        isChecked={form.values[attribute.name]}
                      />
                    )}
                  </Field>
                  {attribute.name}
                </FormControl>
              ))}
            </HStack>

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

            <Button
              colorScheme={"red"}
              ml={4}
              mt={4}
              onClick={onCancel}
            >
              Cancelar
            </Button>

          </Form>
        )}
      </Formik >
    </Box>
  );

}
export default PatientForm;