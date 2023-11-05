import './App.css';

import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Footer } from './components/Footer';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ManageUser } from './pages/ManagerUser';
import { CreateNDF } from './pages/CreateNDF';
import { Forgotpassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ListerFactures } from './pages/ListerFactures';
import { ModifierFacture } from './pages/ModifierFacture';
import { extendTheme } from "@chakra-ui/react"
import { ListerUsers } from './pages/ListerUsers';
import { ModifierUser } from './pages/ModifierUser';
const theme = extendTheme({
  colors: {
    saumon: {
      50: '#ffe6e2',
      100: '#febbb4',
      200: '#fb9084',
      300: '#f86554',
      400: '#f63a23',
      500: '#dd220b',
      600: '#ab1907',
      700: '#7b1104',
      800: '#4b0801',
      900: '#1f0000',
    }
  },
})

function App() {
  return (
    <ChakraProvider className="App" theme={theme}>
      <Box id="content">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/forgotpassword" element={<Forgotpassword />} />
            <Route exact path="/resetpassword" element={<ResetPassword />} />
            <Route exact path="/gestiondupersonnel" element={<ManageUser />} />
            <Route exact path="/genererndf" element={<CreateNDF />} />
            <Route exact path="/listerfactures" element={<ListerFactures />} />
            <Route exact path="/editfacture" element={<ModifierFacture />} />
            <Route exact path="/listerusers" element={<ListerUsers />} />
            <Route exact path="/edituser" element={<ModifierUser />} />
          </Routes>
        </BrowserRouter>
      </Box>
      <Footer />
    </ChakraProvider>
  );
}
export default App;