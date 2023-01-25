import { useState } from 'react'
import Router from './routes/Router'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthProvider';
import { monyxxTheme } from './theme/theme';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ConfigProvider } from './context/ConfigProvider';

const queryClient = new QueryClient()

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={monyxxTheme}>
          <Router />
          <ToastContainer autoClose={1000} />
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
