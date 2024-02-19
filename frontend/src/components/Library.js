import React, { useEffect, useState} from 'react';
import { Col, Container, Row, Card } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Library = () => {
  const userId = useSelector(state => state.user.userId);
  const [classes, setClasses] = useState([]);

  const handleGetClasses = async (classId) => {
    console.log('Get classes');

    const response = await axios.get("http://localhost:5000/gocoachbackend/us-central1/backend/classes/" + userId);

    console.log("RESPONSE DATA FOR GET CLASS", response.data);
    setClasses(response.data);
  }

  useEffect(() => {
    handleGetClasses();
  }, []);
  
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
                <Row className="mt-5">
                      {classes.map((classObj, index) => (
                        <Card key={index} className="mt-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                              <Card.Title>{classObj.name}</Card.Title>
                            </div>
                            <Card.Text>
                              <p>Duration: {classObj.duration}</p>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    </>
  );
};

export default Library;