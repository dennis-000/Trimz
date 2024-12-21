// Importing from pages
import Home from '../pages/Home'
import Services from '../pages/Services'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Contact from '../pages/Contact'
import Barbers from '../pages/Barbers/Barbers'
import BarbersDetails from '../pages/Barbers/BarbersDetails'
import Aboutus from '../pages/Aboutus'
import Dashboard from '../Dashboard/barber-account/Dashboard'
import {Routes, Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import MyAccount from '../Dashboard/user-account/MyAccount'

const Routers = () => {
  return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/barbers" element={<Barbers />} />
    <Route path="/barbers/:id" element={<BarbersDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Signup />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/services" element={<Services />} />
    <Route path="/aboutus" element={<Aboutus />} />

    <Route 
    path="/users/profile/me" 
    element={
      <ProtectedRoute allowedRoles={['customer']} >
        <MyAccount />
      </ProtectedRoute> 
    } 
    />

    <Route 
    path="/barbers/profile/me" 
    element={
      <ProtectedRoute allowedRoles={['provider']}>
        <Dashboard />
      </ProtectedRoute>
    } 
    />
    

  </Routes>
  )
};


export default Routers;