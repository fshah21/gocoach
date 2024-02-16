import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';

const Library = () => {
  const userId = useSelector(state => state.user.userId);
  
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
                <h1>Library User ID: {userId}</h1>
                </Col>
            </Row>
        </Container>
    </>
  );
};

export default Library;