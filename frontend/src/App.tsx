import { Route, Routes } from "react-router"
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"
import UserPanel from "./pages/panel/UserPanel"
import AdminPanel from "./pages/panel/AdminPanel"
import Home from "./pages/home/Home"
import Reservations from "./pages/reservations/Reservations"
import ProtectedRoute from "./protected/ProtectedRoutes"
import Navbar from "./components/layout/Navbar"
import TawkChat from './components/layout/TawkChat'
import Payment from './pages/payment/Payment'

import { ToastContainer } from 'react-toastify';

function App() {


  return (
    <>
      
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            }
          />
          <Route
              path="/reservation"
              element={
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              }
        />
        
        <Route
        path="/payment/:reservationId"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
        
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
      </Routes>
      <TawkChat />
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
 