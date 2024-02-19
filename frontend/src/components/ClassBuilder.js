import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal, Card } from 'react-bootstrap';
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
  const [sections, setSections] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editingSection, setEditingSection] = useState({ 
    name: '',
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
    handleGetSections(class_id);
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
    handleGetSections(classId);
  };

  const handleGetSections = async (classId) => {
    console.log('Get sections');

    const response = await axios.get("http://localhost:5000/gocoachbackend/us-central1/backend/users/" + userId + "/classes/getAllSectionsInClass/" + classId);

    console.log("RESPONSE DATA FOR GET SECTION", response.data);
    setSections(response.data);
  }

  const handleEditSection = (index) => {
    setEditIndex(index);
    setEditingSection({ ...sections[index] });
  };
  
  const handleEditField = (field, value) => {
    setEditingSection({ ...editingSection, [field]: value });
  };
  
  const handleSaveEdit = async (index) => {
    const sectionToDelete = sections[index];
    console.log('Deleted Section Data:', sectionToDelete);
    const updatedSections = [...sections];
    updatedSections[index] = { ...editingSection };
    setSections(updatedSections);
    setEditIndex(-1);

    try {
      const response = await axios.put(
        `http://localhost:5000/gocoachbackend/us-central1/backend/sections/editSection/${sectionToDelete.id}`,
        {
          user_id: userId,
          class_id: classId,
          coach_notes: sectionToDelete.coachNotes,
          display_text: sectionToDelete.displayText,
          start_time: sectionToDelete.startTime,
          finish_time: sectionToDelete.finishTime,
          name: sectionToDelete.name
        }
      );
      console.log('DELETE Section Response:', response.data);
      // Add logic to update state or perform other actions after successful deletion
    } catch (error) {
      console.error('Error deleting section:', error.message);
      // Handle error (display an error message, etc.)
    }
  };
  
  const handleDeleteSection = async (index) => {
    const sectionToDelete = sections[index];
    console.log('Deleted Section Data:', sectionToDelete);
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);

    try {
      const response = await axios.post(
        `http://localhost:5000/gocoachbackend/us-central1/backend/sections/deleteSection/${sectionToDelete.id}`,
        {
          user_id: userId,
          class_id: classId,
        }
      );
      console.log('DELETE Section Response:', response.data);
      // Add logic to update state or perform other actions after successful deletion
    } catch (error) {
      console.error('Error deleting section:', error.message);
      // Handle error (display an error message, etc.)
    }
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
                  <h1>Class Builder</h1>
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
                    </Row>
                    <Row className="mt-5">
                      {sections.map((section, index) => (
                        <Card key={index} className="mt-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                              <Card.Title>{section.name}</Card.Title>
                              <div>
                                <Button variant="outline-primary" className="mr-2" onClick={() => handleEditSection(index)}>
                                  Edit
                                </Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteSection(index)}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                            <Card.Text>
                            <div className="editable-field">
                                <strong>Name:</strong> {editIndex === index ? (
                                  <Form.Control
                                    type="text"
                                    value={editingSection.name}
                                    onChange={(e) => handleEditField('name', e.target.value)}
                                  />
                                ) : (
                                  section.name
                                )}
                              </div>
                              <div className="editable-field">
                                <strong>Start Time:</strong> {editIndex === index ? (
                                  <Form.Control
                                    type="text"
                                    value={editingSection.startTime}
                                    onChange={(e) => handleEditField('startTime', e.target.value)}
                                  />
                                ) : (
                                  section.startTime
                                )}
                              </div>
                              <div className="editable-field">
                                <strong>Finish Time:</strong> {editIndex === index ? (
                                  <Form.Control
                                    type="text"
                                    value={editingSection.finishTime}
                                    onChange={(e) => handleEditField('finishTime', e.target.value)}
                                  />
                                ) : (
                                  section.finishTime
                                )}
                              </div>
                              <div className="editable-field">
                                <strong>Display Text:</strong> {editIndex === index ? (
                                  <Form.Control
                                    type="text"
                                    value={editingSection.displayText}
                                    onChange={(e) => handleEditField('displayText', e.target.value)}
                                  />
                                ) : (
                                  section.displayText
                                )}
                              </div>
                              <div className="editable-field">
                                <strong>Display Text:</strong> {editIndex === index ? (
                                  <Form.Control
                                    type="text"
                                    value={editingSection.coachNotes}
                                    onChange={(e) => handleEditField('coachNotes', e.target.value)}
                                  />
                                ) : (
                                  section.coachNotes
                                )}
                              </div>
                            </Card.Text>
                            {editIndex === index && (
                              <Button variant="primary" onClick={() => handleSaveEdit(index)} className="mt-2">
                                Save
                              </Button>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </Row>
                    <Row>
                      <Col sm={{ span: 8, offset: 4 }} className='mt-5'>
                        <Button variant="secondary" onClick={handleAddSection}>
                          Add Section
                        </Button>
                      </Col>
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