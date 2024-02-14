import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const DefaultNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand className="justify-content-start ms-4" href="#home">GoCoach</Navbar.Brand>
      <Nav className="justify-content-end me-4" style={{ width: "100%" }}>
        <Nav.Link href="/signup">Sign Up</Nav.Link>
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default DefaultNavbar;