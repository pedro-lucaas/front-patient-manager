import Router from './routes/Router'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthProvider';
import { defaultThem } from './theme/theme';
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient()

function App() {
  return (
    <ChakraProvider theme={defaultThem}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router />
          </AuthProvider>
          <ToastContainer autoClose={1000} />
        </QueryClientProvider>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
