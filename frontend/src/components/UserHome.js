import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Card, ListGroup } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsStarFill, BsStar } from 'react-icons/bs';

const UserHome = () => {
  const navigate = useNavigate();
  const userId = useSelector(state => state.user.userId);
  const [classInfo, setClassInfo] = useState(null);
  const [sections, setSections] = useState(null);
  const [pastClassIds, setPastClassIds] = useState([]);
  const [pastSections, setPastSections] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [ratingArray, setRatingArray] = useState([]);

  const handleStartClass = () => {
    console.log("START BUTTON IS CLICKED");
    console.log("CLASS INFO IN START BUTTON", classInfo);
    navigate('/class-display', { state: { classId: classInfo } });
  }

  useEffect(() => {
    const fetchClassAndSections = async () => {
      try {
        console.log("FETCH CLASS AND SECTIONS IN USER HOME");
        // Fetch class for today
        const classResponse = await axios.get('http://localhost:5000/gocoachbackend/us-central1/backend/classes/'+ userId + '/getClassForToday');
        console.log("CLASS RESPONSE", classResponse.data);
        setClassInfo(classResponse.data);

        // Fetch sections for the class
        if(classResponse.data[0] !== undefined) {
          const classId = classResponse.data[0].id;
          const sectionsResponse = await axios.get('http://localhost:5000/gocoachbackend/us-central1/backend/users/'+ userId + '/classes/getAllSectionsInClass/' + classId);
          setSections(sectionsResponse.data);  
        }
        
        const pastClassesResponse = await axios.get(`http://localhost:5000/gocoachbackend/us-central1/backend/classes/${userId}/getPastClasses`);
        setPastClasses(pastClassesResponse.data.slice(0, 2));
        const classIds = pastClassesResponse.data.map(pastClass => pastClass.id);
        setPastClassIds(classIds.slice(0, 2));

        const pastSectionsPromises = classIds.map(async classId => {
          console.log("CLASS ID IN PAST SECTIONS", classId);
          const sectionsResponse = await axios.get(`http://localhost:5000/gocoachbackend/us-central1/backend/users/${userId}/classes/getAllSectionsInClass/${classId}`);
          return sectionsResponse.data;
        });

        const resolvedPastSections = await Promise.all(pastSectionsPromises);
        setPastSections(resolvedPastSections);

        const ratingsInfo = classIds.map(async classId => {
          console.log("GETTING RATING");
          const classInfoResponse = await axios.post(`http://localhost:5000/gocoachbackend/us-central1/backend/classes/${classId}/getClassRating`, {
            user_id: userId
          }
          );
          console.log("CLASS INFO RESPONSE", classInfoResponse.data);
          return classInfoResponse.data.rating;
        })

        const ratingsSet = await Promise.all(ratingsInfo);
        console.log("RATING SET", ratingsSet);
        setRatingArray(ratingsSet);

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
                      { classInfo && classInfo[0]?.name ? (
                        <>
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
                                      <div>
                                        <p className='fw-bold mt-3'>Display Text :</p>
                                        <textarea readOnly rows={3} style={{ border: 'none', resize: 'none', marginBottom: '10px' }}>{section.displayText}</textarea>
                                      </div>
                                      <div>
                                        <p className='fw-bold mt-3'>Coaches notes :</p>
                                        <textarea readOnly rows={3} style={{ border: 'none', resize: 'none' }}>{section.coachNotes}</textarea>
                                      </div>
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
                          <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Recent</h2>
                            {ratingArray[0] && (
                              <div>
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>
                                    {i < ratingArray[0] ? <BsStarFill /> : <BsStar />}
                                  </span>
                                ))}
                              </div>
                            )}
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
                          <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Recent</h2>
                            {ratingArray[1] && (
                              <div>
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>
                                    {i < ratingArray[1] ? <BsStarFill /> : <BsStar />}
                                  </span>
                                ))}
                              </div>
                            )}
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
                        </>

                      ) : (
                        <>
                          <Row>
                            <Col md={5}>
                              {pastClasses[0] && pastSections[0] && (
                                <Card className="mt-5">
                                  <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>Recent</h2>
                                    {ratingArray[0] && (
                                      <div>
                                        {[...Array(5)].map((_, i) => (
                                          <span key={i}>
                                            {i < ratingArray[0] ? <BsStarFill /> : <BsStar />}
                                          </span>
                                        ))}
                                      </div>
                                    )}
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
                            </Col>

                            <Col md={5}>
                              {pastClasses[1] && pastSections[1] && (
                                <Card className="mt-5">
                                  <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>Recent</h2>
                                    {ratingArray[1] && (
                                      <div>
                                        {[...Array(5)].map((_, i) => (
                                          <span key={i}>
                                            {i < ratingArray[1] ? <BsStarFill /> : <BsStar />}
                                          </span>
                                        ))}
                                      </div>
                                    )}
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
                            </Col>
                          </Row>
                        </>
                      )
                    }
                      
                  </Row>
                </Col>
            </Row>
        </Container>
    </>
  );
};

export default UserHome;