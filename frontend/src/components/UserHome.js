import React from 'react';
import { Col, Container, Row, Card } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';

const UserHome = () => {
  const userId = useSelector(state => state.user.userId);
  console.log("USER ID IN USER HOME", userId);

  return (
    <>
        <DefaultNavbar/>
        <Container fluid>
            <Row>
                <Col md={3} className="p-0">
                <LeftNavigation userId={userId}/>
                </Col>
                <Col md={9} className="p-3">
                <h1>Main Content - User ID: {userId}</h1>
                <Row>
                    {/* Big Card taking up the whole height */}
                    <Col md={6} className="mb-3">
                      <div style={{ height: '100%' }}>
                        {/* Your content for Today's Class Card goes here */}
                        <h2>Today's Class</h2>
                        {/* Big Card content */}
                      </div>
                    </Col>

                    {/* Recent Cards */}
                    <Col md={6}>
                      <Row>
                        {/* First Recent Card */}
                        <Row className="mb-3">
                          <div style={{ height: '50%' }}>
                            {/* Your content for the first Recent Card goes here */}
                            <h2>Recent</h2>
                            {/* First small card content */}
                          </div>
                        </Row>

                        {/* Second Recent Card */}
                        <Row>
                          <div style={{ height: '50%' }}>
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