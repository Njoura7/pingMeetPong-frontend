/* eslint-disable @typescript-eslint/no-unused-vars */

import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import { Provider } from 'react-redux';
import { store } from './app/store'; // Import  Redux store


import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
      <ToastContainer/>

        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace/>}/>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
     
      </BrowserRouter>
      </Provider>
  )
}

export default App
