import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DefaultNavbar from './components/DefaultNavbar';
import Signup from './components/Signup'; 
import Home from './components/Home';

const Navigation = () => {
  return (
    <Router>
      <div>
        <Routes>
            <Route path="/" element={<Home />}  />
            <Route path="/signup" element={<Signup />}  />
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation;