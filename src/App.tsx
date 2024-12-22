
import './App.css'
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import NotFound from './pages/NotFound';

import { Provider } from 'react-redux';
import { store } from './app/store';

import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

function App() {

  const Register = lazy(() => import('./pages/Register'));
  const Login = lazy(() => import('./pages/Login'));
  const Dashboard = lazy(() => import('./pages/Dashboard'));
  const UserProfile = lazy(() => import('./pages/UserProfile'));

  return (

    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider >
  )
}

export default App
