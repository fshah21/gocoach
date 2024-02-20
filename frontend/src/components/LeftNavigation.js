import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import PlusIcon from '@material-ui/icons/PlusOne';

const LeftNavigation = (props) => {
  const userName = useSelector(state => state.user.userName);

  return (
    <Nav className="flex-column bg-light sidebar">
      <p className='ms-5 fw-bold'>
        Welcome { userName }!
      </p>
      <Nav.Item>
        <Link to="/userhome" className="nav-link ms-5">Dashboard</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/classbuilder" className="nav-link ms-5">Class Builder</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/library" className="nav-link ms-5">Library</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/account" className="nav-link ms-5">Account</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/settings" className="nav-link ms-5">Settings</Link>
      </Nav.Item>
    </Nav>
  );
};

export default LeftNavigation;