import React, { useEffect } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { useAuth } from '../../context/AuthProvider/useAuth';
import { FormControl, FormLabel, Input, FormErrorMessage, InputGroup, InputRightElement, Button, FormControlProps, InputProps, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"
import redirects from '../../routes/routes';

export const formControlProps: FormControlProps = {
  mb: 12 / 4,
};
export const inputProps: InputProps = {
  bgColor: "gray.50",
  color: "gray.900",
  _focus: { outline: 0 },
  _hover: { outline: 0, boxShadow: "lg" },
  fontSize: ["small", "sm", "md"],
};

const Login = () => {
  const { login } = useAuth();
  const [passwordLoginVisibility, setpasswordLoginVisibility] = React.useState(false)
  const clickPassword = () => setpasswordLoginVisibility(!passwordLoginVisibility)
  const navigate = useNavigate()

  const initialValues = {
    email: "admin@gmail.com",
    password: "123456",
  };

  useEffect(() => {
    localStorage.clear()
  }, [])

  const onSubmit = async ({ email, password }: typeof initialValues, actions: FormikHelpers<typeof initialValues>) => {
    await login(email, password)
    navigate(redirects.HOME)
  }

  return (
    <VStack spacing={4} w={"100%"} h={"100%"} justifyContent={"center"} alignItems={"center"}>
      <Text fontSize={"2xl"}>Login</Text>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form style={{ textAlign: "left", display: "contents", justifyContent: "center", alignItems: "center" }}>
            <Field name="email">
              {({ field, form }: any) => (
                <FormControl placeholder="Email" isInvalid={form.errors.email && form.touched.email} {...formControlProps}>
                  <FormLabel
                    htmlFor="email"
                    fontSize={["md", "16px"]}
                  >
                    Email
                  </FormLabel>
                  <Input {...inputProps} {...field} type="email" id="email" className="input-field" width={"100%"} />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.password && form.touched.password} {...formControlProps}>
                  <FormLabel
                    htmlFor="email"
                    fontSize={["md", "16px"]}
                  >
                    Password
                  </FormLabel>

                  <InputGroup>
                    <Input {...inputProps} {...field} type={passwordLoginVisibility ? "text" : "password"} id="password" className="input-field" w={["sm", "md", "lg"]} />
                    <InputRightElement onClick={clickPassword} cursor={"pointer"}>
                      <Button size={"50px"} bg={"transparent"} onClick={clickPassword} >
                        {passwordLoginVisibility ? <AiFillEye /> : <AiFillEyeInvisible />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Button
              color="gray.500"
              size="sm"
              width={"45%"}
              borderRadius="50"
              bgColor="blue.500"
              isLoading={props.isSubmitting}
              loadingText="Sign in..."
              type="submit"
              disabled={props.isSubmitting || !props.isValid}
            >
              <Text fontSize={["small", "sm", "md"]} color={"#FFFFFF"} >Entrar</Text>
            </Button>
          </Form>
        )}
      </Formik>
    </VStack>
  );

}
export default Login;