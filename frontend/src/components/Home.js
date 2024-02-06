import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import fitness from '../images/fitness.jpg';

const Home = () => {
  return (
    <>
      <DefaultNavbar />
      <Container fluid>
        <Row>
          <Col md={5} className="m-4">
            <div className="m-5">
              <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>
                <span>All your<br/>Coaching tools,<br/>together</span>
              </h2>
              <p style={{ fontSize: '1rem' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquet elit vel nulla cursus, in dictum quam ultrices. Integer vitae dolor id massa bibendum efficitur. Ut accumsan bibendum diam, id scelerisque leo ultrices eu. In hac habitasse platea dictumst.</p>
            </div>
          </Col>
          <Col md={5} className="m-4">
            <div className="m-5">
              <img
                src={fitness}
                alt="fitness"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;