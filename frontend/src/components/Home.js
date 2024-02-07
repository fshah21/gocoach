import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import fitness from '../images/fitness.jpg';

const Home = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const signup = () => {
    console.log("SIGN UP");
  }

  const handleMonthly = () => {
    console.log("HANDLE MONTHLY");
    setBillingCycle('monthly');
  }

  const handleAnnually = () => {
    console.log("HANDLE ANNUALLY");
    setBillingCycle('annually');
  }

  const pricingData = [
    {
      title: 'Solo Coach',
      description: 'For lone wolf coaches, looking to enhance their own skills and hone their craft.',
      price: billingCycle === 'monthly' ? '$15 / per month' : '$299.99/year',
      index: 0,
      features: [
        'Lesson Plan Library',
        'After Class review',
        'Custom timers',
        'Lesson plan Exports',
        'Custom Branding',
        'Team Collaboration',
        'Daily Coaching Tips'
      ],
    },
    {
      title: 'Pro Mentor',
      description: 'Built for elite Coaches, demanding high end features to elevate their skills and collaborate, share and manage teams.',
      price: billingCycle === 'monthly' ? '$29 / per month' : '$499.99/year',
      index: 3,
      features: [
        'Lesson Plan Library',
        'After Class review',
        'Custom timers',
        'Lesson plan Exports',
        'Custom Branding',
        'Team Collaboration',
        'Daily Coaching Tips'
      ],
    },
    {
      title: 'Team Strategist',
      description: 'Run a Coaching team or organization? This plan offers comprehensive tools and functionalities that facilitate collaboration and strategy planning on a larger scale.',
      price: billingCycle === 'monthly' ? '$45 / per month' : '$799.99/year',
      index: 7,
      features: [
        'Lesson Plan Library',
        'After Class review',
        'Custom timers',
        'Lesson plan Exports',
        'Custom Branding',
        'Team Collaboration',
        'Daily Coaching Tips'
      ],
    },
  ];

  return (
    <>
      <DefaultNavbar />
      <Container fluid>
        <Row className="m-5">
          <Col md={5} className="m-4">
            <div className="m-5">
              <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>
                <span>All your<br/>Coaching tools,<br/>together</span>
              </h2>
              <p style={{ fontSize: '1rem' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquet elit vel nulla cursus, in dictum quam ultrices. Integer vitae dolor id massa bibendum efficitur. Ut accumsan bibendum diam, id scelerisque leo ultrices eu. In hac habitasse platea dictumst.</p>
            </div>
          </Col>
          <Col md={5} className="m-4">
            <div className="m-5">
              <img
                src={fitness}
                alt="fitness"
                style={{ width: '700px', height: '700px' }}
              />
            </div>
          </Col>
        </Row>

        <Row className="text-center">
          <h2 style={{ fontSize: '2.8rem', fontWeight: 'bold' }}>
                PRICING
          </h2>
        </Row>

        <Row className="m-4">
          <ToggleButtonGroup
            type="radio"
            name="cycle"
            className="mb-2"
          >
            <ToggleButton value="monthly" onClick={handleMonthly} className="btn btn-primary">Monthly</ToggleButton>
            <ToggleButton value="annual" onClick={handleAnnually} className="btn btn-primary">Annual</ToggleButton>
          </ToggleButtonGroup>
        </Row>

        <Row className="m-5 align-items-center justify-content-center">
          {pricingData.map((item, index) => (
            <Col key={index} md={index === 1 ? 4 : 3} className="mb-4 justify-content-center">
              <Card className="d-flex flex-column h-100">
                <Card.Body className="text-center" style={{ padding: index === 1 ? '4rem' : '1.5rem' }}>
                  <Card.Title style={{ fontSize: '1.8rem', fontWeight: 'bold', textTransform: 'capitalize'}}>{item.title.toLowerCase()}</Card.Title>
                  <Card.Text style={{ fontSize: '1rem'}}>{item.description}</Card.Text>
                  <Card.Text style={{ fontSize: '1.4rem'}}>{item.price}</Card.Text>
                  <ul>
                    {item.features.map((feature, i) => (
                      <li key={i} style={{ listStyleType: 'none', fontSize: '1.1rem' }}>
                        {i === 0  ? '✅' : '❌'} {feature}
                      </li>
                    ))}
                  </ul>
                  <Button bg="dark" variant="dark" onClick={signup}>Sign Up</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;