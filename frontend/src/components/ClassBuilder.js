import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useUserContext } from './UserContext';

const ClassBuilder = () => {
  const { userId } = useUserContext();

  useEffect(() => {
    // This code block will run whenever userId changes
    console.log('ClassBuilder component re-rendered with userId:', userId);

    // Any logic you want to perform when userId changes can go here

    // Cleanup function (optional)
    return () => {
      console.log('Cleanup logic if needed');
    };
  }, [userId]); 

  return (
    <>
        <DefaultNavbar/>
        <Container fluid>
            <Row>
                <Col md={3} className="p-0">
                <LeftNavigation />
                </Col>
                <Col md={9} className="p-3">
                {/* Your main content goes here */}
                <h1>Main Class Builder - User ID: {userId}</h1>
                </Col>
            </Row>
        </Container>
    </>
  );
};

export default ClassBuilder;