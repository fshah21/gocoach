import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DefaultNavbar from './DefaultNavbar';
import { useDispatch } from 'react-redux';
import { setUserId, setUserName } from './actions';

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleSignup = async () => {
        // Handle signup logic here
        console.log("Sign up clicked");
        if (!username || !email || !password) {
          console.error('Please fill in all fields.');
          return;
        }
    
        // Handle signup logic here
        console.log('Signing up with:', username, email, password);

        try {
          // Make a POST request to your API endpoint
          const response = await axios.post('https://us-central1-gocoachbackend.cloudfunctions.net/api/api/users/signup', {
            displayName: username,
            email: email,
            password: password
          });

          console.log('Signup successful:', response.data);    
          dispatch(setUserId(response.data.user_id));
          dispatch(setUserName(response.data.user_name));
          // For demonstration purposes, you can clear the form fields
          setUsername('');
          setEmail('');
          setPassword('');

          navigate('/userhome', { state: { userId: response.data.user_id } });
        } catch (error) {
          // Handle errors, e.g., show an error message to the user
          console.error('Signup failed:', error.message);
        }
      };
    
      return (
        <>
        <DefaultNavbar/>
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
                      <Form.Control type="text" placeholder="username" 
                      value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                      {/* <Form.Label>Email</Form.Label> */}
                      <Form.Control type="email" placeholder="email" 
                      value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                      {/* <Form.Label>Password</Form.Label> */}
                      <Form.Control type="password" placeholder="password" 
                      value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                    <h6>By submitting this form, you agree to our terms of service.</h6>
                    <Button bg="dark" variant="dark" onClick={handleSignup} block className="mt-5">Sign Up</Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
        </>
    );
};

export default Signup;
