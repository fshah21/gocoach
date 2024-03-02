import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DefaultNavbar from './components/DefaultNavbar';
import Signup from './components/Signup'; 
import Home from './components/Home';
import UserHome from './components/UserHome';
import ClassBuilder from './components/ClassBuilder';
import Login from './components/Login';
import Library from './components/Library';
import Account from './components/Account';
import Settings from './components/Settings';
import ClassDisplayScreen from './components/ClassDisplayScreen';

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
            <Route path="/library" element={<Library />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/class-display" element={<ClassDisplayScreen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation;