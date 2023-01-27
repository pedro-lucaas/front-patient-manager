import Router from './routes/Router'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthProvider';
import { defaultThem } from './theme/theme';
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={defaultThem}>
          <Router />
          <ToastContainer autoClose={1000} />
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
