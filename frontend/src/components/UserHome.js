import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useUserContext } from './UserContext';

const UserHome = () => {
  const { userId } = useUserContext();

  return (
    <>
        <DefaultNavbar/>
        <Container fluid>
            <Row>
                <Col md={3} className="p-0">
                <LeftNavigation userId={userId}/>
                </Col>
                <Col md={9} className="p-3">
                {/* Your main content goes here */}
                <h1>Main Content - User ID: {userId}</h1>
                </Col>
            </Row>
        </Container>
    </>
  );
};

export default UserHome;