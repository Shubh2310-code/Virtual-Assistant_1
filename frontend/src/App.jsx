import React, { useContext } from 'react';
import SignUp from './pages/SignUp';
import {Route, Routes, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';
import { UserContext } from './context/UserContext';

function App() {
  const {serverUrl,userData, setUserData}=useContext(UserContext);
  return (
    <Routes>
      <Route path='/' element={userData?.assistantImage && userData.assistantName ? <Home/> : <Navigate to={"/customize"}/>} />
      <Route path='/Home' element={<Home/>} />
      <Route path='/customize' element={<Customize/>} />
      <Route path='/customize2' element={<Customize2/>} />
      <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={"/"}/>} />
      <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to={"/"}/>} />
    </Routes>
  );
}

export default App;
