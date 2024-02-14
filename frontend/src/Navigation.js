import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DefaultNavbar from './components/DefaultNavbar';
import Signup from './components/Signup'; 
import Home from './components/Home';
import UserHome from './components/UserHome';
import ClassBuilder from './components/ClassBuilder';
import Login from './components/Login';

const Navigation = () => {
  return (
    <Router>
      <div>
        <Routes>
            <Route path="/" element={<Home />}  />
            <Route path="/signup" element={<Signup />}  />
            <Route path="/login" element={<Login />}  />
            <Route path="/userhome" element={<UserHome />}  />
            <Route path="/classbuilder" element={<ClassBuilder />}  />
            {/* <Route path="/library" element={<Library />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation;