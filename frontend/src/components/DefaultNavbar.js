import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from './actions';
import { useNavigate } from 'react-router-dom';

const DefaultNavbar = () => {
  const userId = useSelector(state => state.user.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dispatch the logout action to update the Redux store
    console.log("IN LOGOUT");
    dispatch(logoutUser());
    console.log("DISPATCHED");
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand className="justify-content-start ms-4" href="#home">GoCoach</Navbar.Brand>
      <Nav className="justify-content-end me-4" style={{ width: "100%" }}>
        {userId ? (
            // If userId is present, show Logout button
            <Nav.Link onClick={handleLogout}  href="/login">Logout</Nav.Link>
          ) : (
            // If userId is not present, show Sign Up and Login buttons
            <>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            </>
          )}
      </Nav>
    </Navbar>
  );
};

export default DefaultNavbar;