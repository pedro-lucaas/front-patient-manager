import { FormControl, FormLabel, Input, FormErrorMessage, Button, Textarea, FormControlProps, HStack, Box, Flex, Checkbox, Icon, Radio, RadioGroup, Select, Tooltip } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import redirects from '../../routes/routes';
import { PatientFormType } from './types';
import { format } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat, PatternFormat } from 'react-number-format'
import { useState } from 'react';
import { useConfig } from '../../context/ConfigProvider/useConfig';
import { FaEdit } from 'react-icons/fa';
import { PatientFormik } from './PatientFormik';
export const formControlGroupProps: FormControlProps = {
  display: "flex",
  alignItems: "center",
  mb: "40px",
};

export type PatientFormProps = {
  values?: PatientFormType
}

const PatientForm = ({ values }: PatientFormProps) => {
  const navigate = useNavigate()
  const { attributes } = useConfig()

  const initialValues: PatientFormType = {
    id: values?.id || '',
    name: values?.name || '',
    cpf: values?.cpf || '',
    caregiver: values?.caregiver || '',
    email: values?.email || '',
    phone: values?.phone || '',
    phone2: values?.phone2 || '',
    sex: values?.sex || '',
    civilStatus: values?.civilStatus || '',
    birthDate: values?.birthDate && new Date(values?.birthDate) || '',
    schooling: values?.schooling || '',
    addressCep: values?.addressCep || '',
    address: values?.address || '',
    number: values?.number || '',
    complement: values?.complement || '',
    district: values?.district || '',
    city: values?.city || '',
    state: values?.state || '',
    country: values?.country || '',
    comments: values?.comments || '',
    ...attributes?.map((attribute) => ({ [attribute.name]: values && !!values[attribute.name] })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
  }

  const isNew = !values && !initialValues.id;
  const [editMode, setEditMode] = useState(isNew)

  const onCancel = () => {
    navigate(redirects.MEDICAL_RECORDS)
  }

  const formik = PatientFormik(initialValues)

  return (
    <Box>
      <Flex fontSize={"0.8em"} mb={"20px"} opacity={"0.5"}>
        / <Link to={redirects.MEDICAL_RECORDS}>patients</Link> / {!isNew ? values?.name : 'Novo paciente'}
        {!editMode && <Tooltip label="Habilitar edição" size={"xs"}>
          <Button
            ml={"auto"}
            size={"sm"}
            colorScheme={"yellow"}
            onClick={() => setEditMode(!editMode)}
          >
            <Icon as={FaEdit} />
          </Button>
        </Tooltip>
        }
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

      <form onSubmit={formik.handleSubmit} style={{ textAlign: "left", display: "contents", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontSize: "1.5em", marginBottom: "20px" }}>Dados pessoais</h1>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.name && !!formik.touched.name}>
            <FormLabel
              htmlFor="name"
              fontSize={["md", "16px"]}
            >
              Nome
            </FormLabel>
            <Input name="name" type="text" id="name" onChange={formik.handleChange} value={formik.values.name.toUpperCase()} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formik.errors.email && !!formik.touched.email}>
            <FormLabel
              htmlFor="email"
              fontSize={["md", "16px"]}
            >
              E-mail
            </FormLabel>
            <Input name="email" type="email" id="email" onChange={formik.handleChange} value={formik.values.email} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.caregiver && !!formik.touched.caregiver}>
            <FormLabel
              htmlFor="caregiver"
              fontSize={["md", "16px"]}
            >
              Cuidador(a)
            </FormLabel>
            <Input name="caregiver" type="text" id="caregiver" onChange={formik.handleChange} value={formik.values.caregiver} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.caregiver}</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.cpf && !!formik.touched.cpf}>
            <FormLabel
              htmlFor="cpf"
              fontSize={["md", "16px"]}
            >
              CPF
            </FormLabel>
            <Input name="cpf" type="text" id="cpf" as={PatternFormat} format="###.###.###-##" onChange={formik.handleChange} value={formik.values.cpf} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.cpf}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel
              htmlFor="birthDate"
              fontSize={["md", "16px"]}
            >
              Data de Nascimento(a)
            </FormLabel>
            <DatePicker
              id="birthDate"
              name="birthDate"
              value={formik.values.birthDate ? format(new Date(formik.values.birthDate), 'dd/MM/yyyy') : ""}
              onChange={(date: Date) => formik.setFieldValue('birthDate', date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Data de nascimento"
              disabled={!editMode}
              customInput={
                <Input />
              }
            />
          </FormControl>
        </HStack>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.sex && !!formik.touched.sex}>
            <FormLabel
              htmlFor="sex"
              fontSize={["md", "16px"]}
            >
              Sexo Biológico
            </FormLabel>
            <RadioGroup id="sex" name="sex" value={formik.values.sex}
              onChange={(value) => formik.setFieldValue("sex", value)} isDisabled={!editMode} >
              <Radio value="M">Masculino</Radio>
              <Radio value="F">Feminino</Radio>
            </RadioGroup>
          </FormControl>
        </HStack>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.phone && !!formik.touched.phone}>
            <FormLabel
              htmlFor="phone"
              fontSize={["md", "16px"]}
            >
              Telefone
            </FormLabel>
            <Input name="phone" type="phone" id="phone" as={PatternFormat} format="(##) #####-####" onChange={formik.handleChange} value={formik.values.phone} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors.phone2 && !!formik.touched.phone2}>
            <FormLabel
              htmlFor="phone2"
              fontSize={["md", "16px"]}
            >
              Telefone 2
            </FormLabel>
            <Input name="phone2" type="phone" id="phone2" as={PatternFormat} format="(##) #####-####" onChange={formik.handleChange} value={formik.values.phone2} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.phone2}</FormErrorMessage>
          </FormControl>
        </HStack>

        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.schooling && !!formik.touched.schooling}>
            <FormLabel
              htmlFor="sex"
              fontSize={["md", "16px"]}
            >
              Grau de Escolaridade
            </FormLabel>
            <Select
              id="schooling"
              name="schooling"
              value={formik.values.schooling}
              onChange={(e) => formik.setFieldValue("schooling", e.target.value)}
              placeholder='Select option'
              isDisabled={!editMode}
            >
              <option value='EFI'>Ensino Fundamental Incompleto</option>
              <option value='EMI'>Ensino Médio Incompleto</option>
              <option value='ESI'>Ensino Superior Incompleto</option>
              <option value='PG'>Pós-graduaçao</option>
              <option value='MES'>Mestrado</option>
              <option value='DOU'>Doutorado</option>
            </Select>
          </FormControl>
        </HStack>

        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.civilStatus && !!formik.touched.civilStatus}>
            <FormLabel
              htmlFor="civilStatus"
              fontSize={["md", "16px"]}
            >
              Estado Civil
            </FormLabel>
            <RadioGroup id="civilStatus" name="civilStatus" value={formik.values.civilStatus}
              onChange={(value) => formik.setFieldValue("civilStatus", value)} isDisabled={!editMode} >
              <Radio value="solteiro">Solteiro(a)</Radio>
              <Radio value="casado">Casado(a)</Radio>
              <Radio value="separado">Separado(a)</Radio>
              <Radio value="divorciado">Divorciado(a)</Radio>
              <Radio value="viúvo">Viúvo(a)</Radio>
            </RadioGroup>
          </FormControl>
        </HStack>

        <h1 style={{ fontSize: "1.5em", marginBottom: "20px" }}>Endereço</h1>
        <HStack {...formControlGroupProps} maxW={"30%"}>
          <FormControl isInvalid={!!formik.errors.addressCep && !!formik.touched.addressCep}>
            <FormLabel
              htmlFor="addressCep"
              fontSize={["md", "16px"]}
            >
              CEP
            </FormLabel>
            <Input name="addressCep" type="text" id="addressCep" as={PatternFormat} format="#####-###" onChange={formik.handleChange} value={formik.values.addressCep} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.addressCep}</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.address && !!formik.touched.address}>
            <FormLabel
              htmlFor="address"
              fontSize={["md", "16px"]}
            >
              Endereço
            </FormLabel>
            <Input name="address" type="text" id="address" onChange={formik.handleChange} value={formik.values.address} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors.number && !!formik.touched.number} flexShrink={10}>
            <FormLabel
              htmlFor="number"
              fontSize={["md", "16px"]}
            >
              Número
            </FormLabel>
            <Input name="number" type="text" id="number" as={NumericFormat} onChange={formik.handleChange} value={formik.values.number} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.number}</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.complement && !!formik.touched.complement}>
            <FormLabel
              htmlFor="complement"
              fontSize={["md", "16px"]}
            >
              Complemento
            </FormLabel>
            <Input name="complement" type="text" id="complement" onChange={formik.handleChange} value={formik.values.complement} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.complement}</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.district && !!formik.touched.district}>
            <FormLabel
              htmlFor="district"
              fontSize={["md", "16px"]}
            >
              Bairro
            </FormLabel>
            <Input name="district" type="text" id="district" onChange={formik.handleChange} value={formik.values.district} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.district}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors.city && !!formik.touched.city}>
            <FormLabel
              htmlFor="city"
              fontSize={["md", "16px"]}
            >
              Cidade
            </FormLabel>
            <Input name="city" type="text" id="city" onChange={formik.handleChange} value={formik.values.city} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.city}</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack {...formControlGroupProps}>
          <FormControl isInvalid={!!formik.errors.state && !!formik.touched.state}>
            <FormLabel
              htmlFor="state"
              fontSize={["md", "16px"]}
            >
              Estado
            </FormLabel>
            <Input name="state" type="text" id="state" onChange={formik.handleChange} value={formik.values.state} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.state}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors.country && !!formik.touched.country}>
            <FormLabel
              htmlFor="country"
              fontSize={["md", "16px"]}
            >
              País
            </FormLabel>
            <Input name="country" type="text" id="country" onChange={formik.handleChange} value={formik.values.country} disabled={!editMode} />
            <FormErrorMessage>{formik.errors.country}</FormErrorMessage>
          </FormControl>
        </HStack>
        <h1 style={{ fontSize: "1.5em", marginBottom: "20px" }}>Observações</h1>
        <FormControl mb={"40px"} isInvalid={!!formik.errors.comments && !!formik.touched.comments}>
          <Textarea id="comments" name="comments" onChange={formik.handleChange} value={formik.values.comments} disabled={!editMode} />
          <FormErrorMessage>{formik.errors.comments}</FormErrorMessage>
        </FormControl>


        <HStack w={{ sm: "50%" }}>
          {attributes && attributes.map((attribute) => (
            <FormControl key={attribute.name} d={"flex"} alignItems={"center"} textTransform={"capitalize"}>
              <Checkbox
                type="checkbox"
                id={attribute.name}
                name={attribute.name}
                disabled={!editMode}
                onChange={() => {
                  formik.setFieldValue(attribute.name, !formik.values[attribute.name]);
                }}
                isChecked={formik.values[attribute.name]}
              />
              {attribute.name}
            </FormControl>
          ))}
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

        <Button
          colorScheme={"red"}
          ml={4}
          mt={4}
          onClick={onCancel}
        >
          Cancelar
        </Button>

      </form>
    </Box>
  );

}
export default PatientForm;