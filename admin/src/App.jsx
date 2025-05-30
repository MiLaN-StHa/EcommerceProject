import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Order from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import Welcome from './pages/Welcome';
import SupplierManagement from './pages/SupplierManagement';
import CustomizationManagement from './pages/CustomizationManagement';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = 'Rs. ';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ''
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr className='border-gray-300' />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Welcome />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Order token={token} />} />
                <Route path='/supplies' element={<SupplierManagement token={token} />} />
                <Route path='/customization-management' element={<CustomizationManagement />} />
              </Routes>
            </div>
          </div>
        </>}
    </div>
  );
};

export default App;
