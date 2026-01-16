import { Route, Routes } from "react-router"
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"
import UserPanel from "./pages/panel/UserPanel"
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/panel/AdminDashboard';
import AdminUsers from './pages/panel/AdminUsers';
import AdminReservations from './pages/panel/AdminReservations';
import Home from "./pages/home/Home"
import Reservations from "./pages/reservations/Reservations"
import ProtectedRoute from "./protected/ProtectedRoutes"
import Navbar from "./components/layout/Navbar"
import TawkChat from './components/layout/TawkChat'
import Payment from './pages/payment/Payment'
import Footer from './components/layout/Footer'

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
        path="/payment/:reservationId/:price"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route path="/admin-panel" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/reservations" element={<AdminReservations />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
      </Routes>
      <Footer />
      <TawkChat />
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
 