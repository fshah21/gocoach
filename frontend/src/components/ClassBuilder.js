import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";

const ClassBuilder = () => {
  const userId = useSelector(state => state.user.userId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [classId, setClassId] = useState('');
  const [sectionData, setSectionData] = useState({
    sectionName: '',
    startTime: '',
    finishTime: '',
    displayText: '',
    coachesNotes: ''
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Date:', selectedDate);
    console.log('Name:', name);
    console.log('Duration:', duration);
    // Perform additional actions, e.g., save data

    const response = await axios.post("http://localhost:5000/gocoachbackend/us-central1/backend/classes/createClass", {
      user_id: userId,
      class_name: name,
      class_duration: duration,
      class_date: selectedDate
    })

    console.log("RESPONSE", response.data);
    const class_id = response.data.class_id;
    console.log("CLASS ID", class_id);
    setClassId(class_id);
  };

  const handleSectionInputChange = (e) => {
    setSectionData({
      ...sectionData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSection = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveSection = async () => {
    // Handle saving section data
    console.log('Section Data:', sectionData);

    const response = await axios.post("http://localhost:5000/gocoachbackend/us-central1/backend/classes/addSection/" + classId, {
      user_id: userId,
      section_name: sectionData.sectionName,
      section_start_time: sectionData.startTime,
      section_finish_time: sectionData.finishTime,
      section_display_text: sectionData.displayText,
      section_coach_notes: sectionData.coachesNotes
    })

    console.log("RESPONSE DATA FOR SECTION", response.data);

    console.log("SECTIONS", response.data.section_id);

    // Add logic to save the section data to your state or perform other actions
    handleCloseModal();
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
                      <Col>
                        <Button type="submit" onClick={handleSubmit} >Save Class</Button>{' '}
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

                          <Col>
                          </Col>

                          <Row>
                            <Col sm={{ span: 8, offset: 4 }}>
                              <Button type="submit" onClick={handleSubmit} >Save</Button>{' '}
                              <Button variant="secondary" onClick={handleAddSection}>
                                Add Section
                              </Button>
                            </Col>
                          </Row>
                    </Row>
                  </Container>
                </Col>
            </Row>
        </Container>

        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="sectionName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="sectionName"
                value={sectionData.sectionName}
                onChange={handleSectionInputChange}
              />
            </Form.Group>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time:</Form.Label>
              <Form.Control
                type="number"
                name="startTime"
                value={sectionData.startTime}
                onChange={handleSectionInputChange}
              />
            </Form.Group>
            <Form.Group controlId="finishTime">
              <Form.Label>Finish Time:</Form.Label>
              <Form.Control
                type="number"
                name="finishTime"
                value={sectionData.finishTime}
                onChange={handleSectionInputChange}
              />
            </Form.Group>
            <Form.Group controlId="displayText">
              <Form.Label>Display Text:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="displayText"
                value={sectionData.displayText}
                onChange={handleSectionInputChange}
              />
            </Form.Group>
            <Form.Group controlId="coachesNotes">
              <Form.Label>Coach's Notes:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="coachesNotes"
                value={sectionData.coachesNotes}
                onChange={handleSectionInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveSection}>
            Save Section
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClassBuilder;