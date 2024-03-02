import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Card, ListGroup } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
  const navigate = useNavigate();
  const userId = useSelector(state => state.user.userId);
  const [classInfo, setClassInfo] = useState(null);
  const [sections, setSections] = useState(null);
  const [pastClassIds, setPastClassIds] = useState([]);
  const [pastSections, setPastSections] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);

  const handleStartClass = () => {
    console.log("START CLASS IS CLICKED");
    navigate('/class-display', { state: { classId: classInfo } });
  }

  useEffect(() => {
    const fetchClassAndSections = async () => {
      try {
        // Fetch class for today
        const classResponse = await axios.get('http://localhost:5000/gocoachbackend/us-central1/backend/classes/'+ userId + '/getClassForToday');
        setClassInfo(classResponse.data);

        // Fetch sections for the class
        const classId = classResponse.data[0].id;
        const sectionsResponse = await axios.get('http://localhost:5000/gocoachbackend/us-central1/backend/users/'+ userId + '/classes/getAllSectionsInClass/' + classId);
        setSections(sectionsResponse.data);

        const pastClassesResponse = await axios.get(`http://localhost:5000/gocoachbackend/us-central1/backend/classes/${userId}/getPastClasses`);
        setPastClasses(pastClassesResponse.data.slice(0, 2));
        const classIds = pastClassesResponse.data.map(pastClass => pastClass.id);
        setPastClassIds(classIds.slice(0, 2));

        const pastSectionsPromises = pastClassIds.map(async classId => {
          const sectionsResponse = await axios.get(`http://localhost:5000/gocoachbackend/us-central1/backend/users/${userId}/classes/getAllSectionsInClass/${classId}`);
          return sectionsResponse.data;
        });

        const resolvedPastSections = await Promise.all(pastSectionsPromises);
        setPastSections(resolvedPastSections);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClassAndSections();
  }, [userId, pastClassIds, classInfo]);

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
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h2>Today's Class</h2>
                            <button className="btn btn-primary" onClick={() => handleStartClass(classInfo)}>
                              START
                            </button>
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
                    {pastClasses[0] && pastSections[0] && (
                      <Card className="mt-5">
                        <Card.Header>
                          <h2>Recent</h2>
                        </Card.Header>
                        <Card.Body>
                          <Card.Title>{pastClasses[0].className}</Card.Title>
                          <Card.Text>{pastClasses[0].classDescription}</Card.Text>

                          <ListGroup variant="flush">
                            {pastSections[0].map(section => (
                              <ListGroup.Item key={section.sectionId}>
                                <h5 className='fw-bold'>{section.name} | {`${section.startTime} - ${section.finishTime}`} Mins </h5>
                                <p>{section.displayText}</p>
                                <p>{section.coachNotes}</p>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Card.Body>
                      </Card>
                    )}
                  </Row>

                  {/* Second Recent Card */}
                  <Row>
                    {pastClasses[1] && pastSections[1] && (
                      <Card className="mt-5">
                        <Card.Header>
                          <h2>Recent</h2>
                        </Card.Header>
                        <Card.Body>
                          <Card.Title>{pastClasses[1].className}</Card.Title>
                          <Card.Text>{pastClasses[1].classDescription}</Card.Text>

                          <ListGroup variant="flush">
                            {pastSections[1].map(section => (
                              <ListGroup.Item key={section.sectionId}>
                                <h5 className='fw-bold'>{section.name} | {`${section.startTime} - ${section.finishTime}`} Mins </h5>
                                <p>{section.displayText}</p>
                                <p>{section.coachNotes}</p>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Card.Body>
                      </Card>
                    )}
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