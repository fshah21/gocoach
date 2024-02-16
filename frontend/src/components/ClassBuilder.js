import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

const ClassBuilder = () => {
  const userId = useSelector(state => state.user.userId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Date:', selectedDate);
    console.log('Name:', name);
    console.log('Duration:', duration);
    // Perform additional actions, e.g., save data
  };
  
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
                  <h1>Class Builder - {userId}</h1>
                  <Container>
                    <Row>
                      <Col>
                        <h5>Date : </h5>
                      </Col>
                      <Col>
                        <h5>Name : </h5>
                      </Col>
                      <Col>
                        <h5>Class Duration : </h5>
                      </Col>
                    </Row>
                    <Row>
                        <Col>
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                          />
                        </Col>

                          <Col>
                            <Form.Control
                              type="text"
                              placeholder="Enter your name"
                              value={name}
                              onChange={handleNameChange}
                            />
                          </Col>

                          <Col>
                            <Form.Control
                              type="text"
                              placeholder="Enter class duration"
                              value={duration}
                              onChange={handleDurationChange}
                            />
                          </Col>

                          <Row>
                            <Col sm={{ span: 8, offset: 4 }}>
                              <Button type="submit" onClick={handleSubmit} >Save</Button>{' '}
                              <Button variant="secondary" onClick={() => console.log('Add Section clicked')}>
                                Add Section
                              </Button>
                            </Col>
                          </Row>
                    </Row>
                  </Container>
                </Col>
            </Row>
        </Container>
    </>
  );
};

export default ClassBuilder;