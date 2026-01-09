import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import UserManagement from './pages/Users';
import RoomManagement from './pages/Rooms';
import BookingManagement from './pages/Bookings';
import BillingManagement from './pages/Billing';
import Settings from './pages/Settings';
import Housekeeping from './pages/Housekeeping';
import MyBookings from './pages/MyBookings';
import GuestRooms from './pages/GuestRooms';
import Events from './pages/Events';
import EventsManagement from './pages/EventsManagement';
import Inquiries from './pages/Inquiries';
import RoomDetails from './pages/RoomDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Register from './pages/Register';
import ContactUs from './pages/ContactUs';
import FAQs from './pages/FAQs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import Invoice from './pages/Invoice';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const HomeRoute = () => {
  const { user } = useAuth();
  if (user?.role === 'receptionist') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Home />;
};

import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';

import ToastContainer from './components/ToastContainer';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <SocketProvider>
            <NotificationProvider>
              <ToastContainer />
              <ChatProvider>
                <BrowserRouter>
                <Routes>
                  <Route path="/" element={<HomeRoute />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/rooms" element={<GuestRooms />} />
                  <Route path="/rooms/:id" element={<RoomDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="rooms" element={<RoomManagement />} />
                    <Route path="bookings" element={<BookingManagement />} />
                    <Route path="billing" element={<BillingManagement />} />
                    <Route path="housekeeping" element={<Housekeeping />} />
                    <Route path="events" element={<EventsManagement />} />
                    <Route path="inquiries" element={<Inquiries />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
      
                  <Route path="/my-bookings" element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  } />
                  <Route path="/invoice/:id" element={
                    <ProtectedRoute>
                      <Invoice />
                    </ProtectedRoute>
                  } />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </ChatProvider>
          </NotificationProvider>
          </SocketProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
