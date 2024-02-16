import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LeftNavigation = (props) => {
  return (
    <Nav className="flex-column bg-light sidebar">
      <Nav.Item>
        <Link to="/userhome" className="nav-link">Dashboard</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/classbuilder" className="nav-link">Class Builder</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/library" className="nav-link">Library</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/account" className="nav-link">Account</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/settings" className="nav-link">Settings</Link>
      </Nav.Item>
    </Nav>
  );
};

export default LeftNavigation;