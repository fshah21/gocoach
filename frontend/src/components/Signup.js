import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

const Signup = () => {
    const handleSignup = () => {
        // Handle signup logic here
        console.log("Sign up clicked");
      };
    
      return (
        <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
          <Card style={{ minWidth: '500px', width: '90%', height: '65%' }}>
            <Card.Body>
              <Row className="text-center">
                <Col>
                  <h2>Create a New Account</h2>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col xs={5} className="border-end pe-4">
                  <Row className="mb-3">
                    <Col>
                      <h5>Why be old-fashioned?</h5>
                      <h5>Just sign in with:</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {/* Add Facebook and Google signup buttons */}
                      <Button variant="primary" className="me-2">Facebook</Button>
                      <Button variant="danger">Google</Button>
                    </Col>
                  </Row>
                </Col>
                <Col xs={7} className="ps-4">
                  <Form>
                    <Form.Group className="mb-3" controlId="username">
                      {/* <Form.Label>Username</Form.Label> */}
                      <Form.Control type="text" placeholder="username" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                      {/* <Form.Label>Email</Form.Label> */}
                      <Form.Control type="email" placeholder="email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                      {/* <Form.Label>Password</Form.Label> */}
                      <Form.Control type="password" placeholder="password" />
                    </Form.Group>
                    <h6>By submitting this form, you agree to our terms of service.</h6>
                    <Button bg="dark" variant="dark" onClick={handleSignup} block className="mt-5">Sign Up</Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
    );
};

export default Signup;
