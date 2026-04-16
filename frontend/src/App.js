import React from 'react';
import './App.css';
import MatchPage from './components/police/MatchPage';
import { Route, Routes } from "react-router-dom";
import HomePage from './components/HomePage';
import Test from './components/Test';
import Navbar from './components/Navbar';
import PoliceHome from './components/police/PoliceHome';
import Login from './components/Login';
import Register from './components/Register';


function App() {
  const [loggedIn, setLoggedIn] = React.useState(()=>{
    if(localStorage.getItem('access_token')){
      return true;
    }
    return false; 
  });
  return (
    <>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>

      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path='/login' element={<Login setLoggedIn={setLoggedIn}/>} />
        <Route path='/Register' element={<Register />} />
        <Route path="/police" element={<PoliceHome />} />
      </Routes>
    </>
  );
}

export default App;
