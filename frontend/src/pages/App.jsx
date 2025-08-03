import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import '../i18n'
import NepaliNavbar from '../components/NepaliNavbar'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Services from './Services'
import ServiceProviders from './ServiceProviders'
import ProviderProfile from './ProviderProfile'
import BookingForm from './BookingForm'
import Dashboard from './Dashboard'
import AdminDashboard from './AdminDashboard'
import SewaAI from './SewaAI'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <NepaliNavbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<Services />} />
              <Route path="/providers" element={<ServiceProviders />} />
              <Route path="/provider/:id" element={<ProviderProfile />} />
              <Route path="/book/:providerId" element={<BookingForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/sewai" element={<SewaAI />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
