import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Card, ListGroup } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UserHome = () => {
  const userId = useSelector(state => state.user.userId);
  console.log("USER ID IN USER HOME", userId);
  const [classInfo, setClassInfo] = useState(null);
  const [sections, setSections] = useState(null);

  useEffect(() => {
    const fetchClassAndSections = async () => {
      try {
        // Fetch class for today
        const classResponse = await axios.get('http://localhost:5000/gocoachbackend/us-central1/backend/classes/'+ userId + '/getClassForToday');
        console.log("CLASS RESPONSE DATA", classResponse.data);
        setClassInfo(classResponse.data);

        // Fetch sections for the class
        const classId = classResponse.data[0].id;
        console.log("CLASS ID", classId);
        const sectionsResponse = await axios.get('http://localhost:5000/gocoachbackend/us-central1/backend/users/'+ userId + '/classes/getAllSectionsInClass/' + classId);
        console.log("SECTION RESPONSE DATA", sectionsResponse.data);
        setSections(sectionsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClassAndSections();
  }, []);

  return (
    <>
        <DefaultNavbar/>
        <Container fluid>
            <Row>
                <Col md={3} className="p-0">
                <LeftNavigation userId={userId}/>
                </Col>
                <Col md={9} className="p-3">
                <Row>
                    {/* Big Card taking up the whole height */}
                    <Col md={6} className="mb-3">
                      <div style={{ height: '100%' }}>
                        {/* Your content for Today's Class Card goes here */}
                        <Card className="mt-5">
                          <Card.Header>
                            <h2>Today's Class</h2>
                          </Card.Header>
                          <Card.Body>
                            {classInfo && (
                              <>
                                <Card.Title>{classInfo.className}</Card.Title>
                                <Card.Text>{classInfo.classDescription}</Card.Text>
                              </>
                            )}

                            {sections && (
                              <ListGroup variant="flush">
                                {sections.map(section => (
                                  <ListGroup.Item key={section.sectionId}>
                                    <h5 className='fw-bold'>{section.name} | {`${section.startTime} - ${section.finishTime}`} Mins </h5> 
                                    <p>{section.displayText}</p>
                                    <p>{section.coachNotes}</p>
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            )}
                          </Card.Body>
                        </Card>
                        {/* Big Card content */}
                      </div>
                    </Col>

                    {/* Recent Cards */}
                    <Col md={6}>
                      <Row>
                        {/* First Recent Card */}
                        <Row className="mb-3">
                          <div style={{ height: '50%' }} className="mt-5">
                            {/* Your content for the first Recent Card goes here */}
                            <h2>Recent</h2>
                            {/* First small card content */}
                          </div>
                        </Row>

                        {/* Second Recent Card */}
                        <Row>
                          <div style={{ height: '50%' }}  className="mt-5">
                            {/* Your content for the second Recent Card goes here */}
                            {/* Second small card content */}
                            <h2>Recent 2</h2>
                          </div>
                        </Row>
                      </Row>
                    </Col>
                  </Row>
                </Col>
            </Row>
        </Container>
    </>
  );
};

export default UserHome;