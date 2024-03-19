import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Card, Button } from 'react-bootstrap';
import DefaultNavbar from './DefaultNavbar';
import LeftNavigation from './LeftNavigation';
import { useSelector } from 'react-redux';

const Settings = () => {
  const userId = useSelector(state => state.user.userId);
  const [fontType, setFontType] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [clockSound, setClockSound] = useState('');
  const [themeMode, setThemeMode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('****-****-****-3290');

  // Function to handle adding a payment card (dummy implementation)
  const handleAddPaymentCard = () => {
    // Implement your logic here to open modal for adding payment card
  };

  // Function to handle selection of font type
  const handleFontTypeSelection = (selectedFont) => {
    setFontType(selectedFont);
  };

  // Function to handle selection of background color
  const handleBackgroundColorSelection = (selectedColor) => {
    setBackgroundColor(selectedColor);
  };

  // Function to handle selection of clock sound
  const handleClockSoundSelection = (selectedSound) => {
    setClockSound(selectedSound);
  };

  // Function to handle selection of theme mode
  const handleThemeModeSelection = (selectedMode) => {
    setThemeMode(selectedMode);
  };

  return (
    <>
      <DefaultNavbar />
      <Container fluid>
        <Row>
          <Col md={3} className="p-0">
            <LeftNavigation />
          </Col>
          <Col md={9} className="p-3">
          <Card className='mb-5 mt-5'>
            <Card.Body>
              <Card.Title>Personalization</Card.Title>
              {/* Font Type options */}
              <div>
                <label>Font Type:</label>
                <span style={{ display: "inline-block", border: "1px solid black", padding: "5px", margin: "5px", backgroundColor: fontType === 'Arial' ? 'lightgray' : 'transparent', cursor: 'pointer' }} onClick={() => handleFontTypeSelection('Arial')}>Arial</span>
                <span style={{ display: "inline-block", border: "1px solid black", padding: "5px", margin: "5px", backgroundColor: fontType === 'Times New Roman' ? 'lightgray' : 'transparent', cursor: 'pointer' }} onClick={() => handleFontTypeSelection('Times New Roman')}>Times New Roman</span>
                {/* Add more font options if needed */}
              </div>

              {/* Background Color options */}
              <div>
                <label>Background Color:</label>
                <span style={{ display: "inline-block", border: "1px solid black", padding: "5px", margin: "5px", backgroundColor: backgroundColor === 'Blue' ? 'lightblue' : 'transparent', cursor: 'pointer' }} onClick={() => handleBackgroundColorSelection('Blue')}>Blue</span>
                <span style={{ display: "inline-block", border: "1px solid black", padding: "5px", margin: "5px", backgroundColor: backgroundColor === 'Black' ? 'black' : 'transparent', color: backgroundColor === 'Black' ? 'white' : 'black', cursor: 'pointer' }} onClick={() => handleBackgroundColorSelection('Black')}>Black</span>
                {/* Add more color options if needed */}
              </div>

              {/* Clock Sound options */}
              <div>
                <label>Clock Sounds:</label>
                <span style={{ display: "inline-block", border: "1px solid black", padding: "5px", margin: "5px", backgroundColor: clockSound === 'Number 1' ? 'lightgray' : 'transparent', cursor: 'pointer' }} onClick={() => handleClockSoundSelection('Number 1')}>Number 1</span>
                <span style={{ display: "inline-block", border: "1px solid black", padding: "5px", margin: "5px", backgroundColor: clockSound === 'Number 2' ? 'lightgray' : 'transparent', cursor: 'pointer' }} onClick={() => handleClockSoundSelection('Number 2')}>Number 2</span>
                {/* Add more sound options if needed */}
              </div>

              {/* Theme Mode options */}
              <div>
                <label>Theme Mode:</label>
                <span style={{ display: "inline-block", border: "1px solid black", padding: "5px", margin: "5px", backgroundColor: themeMode === 'Dark' ? 'black' : 'transparent', color: themeMode === 'Dark' ? 'white' : 'black', cursor: 'pointer' }} onClick={() => handleThemeModeSelection('Dark')}>Dark</span>
                <span style={{ display: "inline-block", border: "1px solid black", padding: "5px", margin: "5px", backgroundColor: themeMode === 'Light' ? 'lightgray' : 'transparent', cursor: 'pointer' }} onClick={() => handleThemeModeSelection('Light')}>Light</span>
              </div>
            </Card.Body>
          </Card>


            <Card className="mt-3">
              <Card.Body>
                <Card.Title>Payments</Card.Title>
                <Card.Text>Current Payment Method: {paymentMethod}</Card.Text>
                <Button variant="primary" onClick={handleAddPaymentCard}>
                  Add Payment Card
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Settings;