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
  const [toggleTimer, setToggleTimer] = useState(false);
  const [timerInput, setTimerInput] = useState(0);
  const [countDirection, setCountDirection] = useState('up');
  const [prepTime, setPrepTime] = useState(0);
  const [prepTimeToggle, setPrepTimeToggle] = useState(false);
  const [toggleInterval, setToggleInterval] = useState(false);
  const [intervalTime, setIntervalTime] = useState(false);

  const handleToggleTimer = () => {
    setToggleTimer(!toggleTimer);
  };

  const handlePrepTimeToggle = () => {
    setPrepTimeToggle(!prepTimeToggle);
  };
  
  const handleCountDirectionChange = (direction) => {
    setCountDirection(direction);
  };
  
  const handleToggleInterval = () => {
    setToggleInterval(!toggleInterval);
  };

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
                              <div className="d-flex justify-content-end align-items-end">
                                <Button variant="outline-primary" className="mr-3" onClick={() => handleEditSection(index)}>
                                  EDIT
                                </Button>
                                <Button variant="outline-danger" className="ml-3" onClick={() => handleDeleteSection(index)}>
                                  DELETE
                                </Button>
                              </div>
                            <Card.Text>
                              <Row>
                                <Col md={3}>
                                  <div className="editable-field">
                                    <strong>NAME:</strong> {editIndex === index ? (
                                      <Form.Control
                                        type="text"
                                        value={editingSection.name}
                                        onChange={(e) => handleEditField('name', e.target.value)}
                                      /> 
                                    ) : (
                                      <Form.Control type="text" value={section.name.toUpperCase()} onChange={(e) => handleEditField('name', e.target.value)} readOnly/> 
                                    )}
                                  </div>
                                  <Row className='mt-2'>
                                    <Col md={6}>
                                      <strong>START TIME:</strong>
                                    </Col>
                                    <Col md={6}>
                                      <strong>FINISH TIME:</strong>
                                    </Col>
                                  </Row>
                                  <Row>
                                  <Col md={6}>
                                    <div className="editable-field">
                                    {editIndex === index ? (
                                      <Form.Control
                                        type="text"
                                        value={editingSection.startTime}
                                        onChange={(e) => handleEditField('startTime', e.target.value)}
                                      />
                                    ) : (
                                      <Form.Control type="text" value={section.startTime} onChange={(e) => handleEditField('startTime', e.target.value)} readOnly/> 
                                    )}
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <div className="editable-field">
                                    {editIndex === index ? (
                                      <Form.Control
                                        type="text"
                                        value={editingSection.finishTime}
                                        onChange={(e) => handleEditField('finishTime', e.target.value)}
                                      />
                                    ) : (
                                      <Form.Control type="text" value={section.finishTime} onChange={(e) => handleEditField('finishTime', e.target.value)} readOnly/> 
                                    )}
                                  </div>
                                  </Col>
                                </Row>
                                </Col>
                                <Col md={3}>
                                  <div className="editable-field">
                                    <strong>DISPLAY TEXT:</strong> {editIndex === index ? (
                                      <Form.Control
                                        value={editingSection.displayText}
                                        as="textarea"
                                        rows={3}
                                        onChange={(e) => handleEditField('displayText', e.target.value)}
                                      />
                                    ) : (
                                      <Form.Control as="textarea" rows={6} value={section.displayText} onChange={(e) => handleEditField('displayText', e.target.value)} readOnly/> 
                                    )}
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div className="editable-field">
                                    <strong>COACH NOTES:</strong> {editIndex === index ? (
                                      <Form.Control
                                        value={editingSection.coachNotes}
                                        as="textarea"
                                        rows={3}
                                        onChange={(e) => handleEditField('coachNotes', e.target.value)}
                                      />
                                    ) : (
                                      <Form.Control as="textarea" rows={6} value={section.coachNotes} onChange={(e) => handleEditField('coachNotes', e.target.value)} readOnly/> 
                                    )}
                                  </div>
                                </Col>
                              </Row>
                              <Col md={6}>
                                  
                              </Col>
                              <Col md={6}>
                                
                              </Col>
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
            <br/>
            <Form.Group controlId="toggleTimer">
              <Form.Check
                type="switch"
                label="Timer"
                name="toggleTimer"
                onChange={() => handleToggleTimer()}
              />
            </Form.Group>

          {/* Input for Timer */}
          {toggleTimer && (
            <Form.Group controlId="timerInput">
              <Form.Label>Timer Duration (HH:mm:ss):</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="number"
                  name="timerHours"
                  placeholder="HH"
                  className="mr-2"
                  min="0"
                  max="99"
                  value={sectionData.timerHours}
                  onChange={handleSectionInputChange}
                />
                <Form.Control
                  type="number"
                  name="timerMinutes"
                  placeholder="mm"
                  className="mr-2"
                  min="0"
                  max="59"
                  value={sectionData.timerMinutes}
                  onChange={handleSectionInputChange}
                />
                <Form.Control
                  type="number"
                  name="timerSeconds"
                  placeholder="ss"
                  min="0"
                  max="59"
                  value={sectionData.timerSeconds}
                  onChange={handleSectionInputChange}
                />
              </div>
            </Form.Group>
          )}

          <br/>

          {/* Count Up or Count Down */}
          <Form.Group controlId="countDirection" className="d-flex align-items-center">
            <Form.Label><span>Count Down   </span></Form.Label>
            <Form.Check
              type="switch"
              label="Count Up"
              name="toggleTimer"
              onChange={() => handleCountDirectionChange()}
            />
          </Form.Group>

          <br/>

          {/* Prep Time */}
          <Form.Group controlId="prepTime">
            <Form.Check
                type="switch"
                label="Prep Time"
                name="toggleTimer"
                onChange={() => handlePrepTimeToggle()}
              />
          </Form.Group>

          {prepTimeToggle && (
            <Form.Group controlId="prepTimeInput">
              <Form.Label>Prep Time (HH:mm:ss):</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="number"
                  name="prepTimeHours"
                  placeholder="HH"
                  className="mr-2"
                  min="0"
                  max="99"
                  value={sectionData.prepTimeHours}
                  onChange={handleSectionInputChange}
                />
                <Form.Control
                  type="number"
                  name="prepTimeMinutes"
                  placeholder="mm"
                  className="mr-2"
                  min="0"
                  max="59"
                  value={sectionData.prepTimeMinutes}
                  onChange={handleSectionInputChange}
                />
                <Form.Control
                  type="number"
                  name="prepTimeSeconds"
                  placeholder="ss"
                  min="0"
                  max="59"
                  value={sectionData.prepTimeSeconds}
                  onChange={handleSectionInputChange}
                />
              </div>
            </Form.Group>
          )}

          <br/>

          {/* Toggle for Interval Time */}
          <Form.Group controlId="toggleInterval">
            <Form.Check
              type="switch"
              label="Enable Interval Time"
              name="toggleInterval"
              onChange={() => handleToggleInterval()}
            />
          </Form.Group>

          {/* Input for Interval Time */}
          {toggleInterval && (
            <Form.Group controlId="intervalTime">
              <Form.Label>Interval Time (HH:mm:ss):</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="number"
                  name="intervalHours"
                  placeholder="HH"
                  className="mr-2"
                  min="0"
                  max="99"
                  value={sectionData.intervalHours}
                  onChange={handleSectionInputChange}
                />
                <Form.Control
                  type="number"
                  name="intervalMinutes"
                  placeholder="mm"
                  className="mr-2"
                  min="0"
                  max="59"
                  value={sectionData.intervalMinutes}
                  onChange={handleSectionInputChange}
                />
                <Form.Control
                  type="number"
                  name="intervalSeconds"
                  placeholder="ss"
                  min="0"
                  max="59"
                  value={sectionData.intervalSeconds}
                  onChange={handleSectionInputChange}
                />
              </div>
            </Form.Group>
          )}
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