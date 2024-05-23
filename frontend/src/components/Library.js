import React, { useEffect, useState} from 'react';
import { Col, Container, Row, Card, Button, Spinner } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Library = () => {
  const userId = useSelector(state => state.user.userId);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(null);
  const [loadingSections, setLoadingSections] = useState(false);

  const handleGetClasses = async () => {
    console.log('Get classes');

    const response = await axios.get("https://us-central1-gocoachbackend.cloudfunctions.net/api/api/classes/" + userId);

    console.log("RESPONSE DATA FOR GET CLASS", response.data);
    setClasses(response.data);
  }

  useEffect(() => {
    handleGetClasses();
  }, []);

  const handleClassCardClick = async (index) => {
    console.log("CARD IS CLICKED", index);
    setSelectedClassIndex(index);
    setLoadingSections(true);

    const classObj = classes[index];
    console.log(classObj);

    try {
      const response = await axios.get("https://us-central1-gocoachbackend.cloudfunctions.net/api/api/users/" + userId + "/classes/getAllSectionsInClass/" + classObj.id);
  
      console.log("RESPONSE DATA FOR GET SECTION", response.data);
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoadingSections(false);
    }
  } 

  const handleBackButtonClick = () => {
    setSelectedClassIndex(null);
  }
  
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
                <h1>Library</h1>
                {selectedClassIndex !== null ? (
              /* Display sections for the selected class */
              <>
                <Button className="mb-3" onClick={handleBackButtonClick}>Back</Button>
                <h2>{classes[selectedClassIndex].name} Sections</h2>
                {loadingSections ? (
                  <Spinner animation="border" role="status">
                    {/* <span >Loading...</span> */}
                  </Spinner>
                ) : (
                  <Row>
                    {/* Render sections here */}
                    {sections.map((section, index) => (
                      <Card key={index} className="mt-3">
                        <Card.Body>
                          <Card.Title>{section.name}</Card.Title>
                          <Card.Body>
                            <Card.Text>Start Time : {section.startTime}</Card.Text>
                            <Card.Text>Finish Time : {section.finishTime}</Card.Text>
                            <Card.Text>Display Text : {section.displayText}</Card.Text>
                            <Card.Text>Coach Notes : {section.coachNotes}</Card.Text>
                          </Card.Body>
                        </Card.Body>
                      </Card>
                    ))}
                  </Row>
                )}
              </>
            ) : (
              /* Display all classes */
              <Row className="mt-5">
                {classes.map((classObj, index) => (
                  <Card key={index} className="mt-3" onClick={() => handleClassCardClick(index)}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title>{classObj.name}</Card.Title>
                      </div>
                      <Card.Text>
                        <p>Date : {classObj.date}</p>
                        <p>Duration: {classObj.duration}</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Row>
            )}
                </Col>
            </Row>
        </Container>
    </>
  );
};

export default Library;