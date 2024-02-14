import React from 'react';
import { Nav } from 'react-bootstrap';

const LeftNavigation = (props) => {
  return (
    <Nav className="flex-column bg-light sidebar">
      <Nav.Item>
        <Nav.Link href="/userHome">Dashboard</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/classbuilder">Class Builder</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#services">Library</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#contact">Account</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#contact">Settings</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default LeftNavigation;