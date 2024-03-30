import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddPaymentCardModal = ({ show, handleClose, handleAddCard }) => {
  const [cardNumber1, setCardNumber1] = useState('');
  const [cardNumber2, setCardNumber2] = useState('');
  const [cardNumber3, setCardNumber3] = useState('');
  const [cardNumber4, setCardNumber4] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');


  const handleCardNumber1Change = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setCardNumber1(input.substring(0, 4));
    if (input.length === 4) {
      document.getElementById('cardNumber2').focus();
    }
  };

  const handleCardNumber2Change = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setCardNumber2(input.substring(0, 4));
    if (input.length === 4) {
      document.getElementById('cardNumber3').focus();
    }
  };

  const handleCardNumber3Change = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setCardNumber3(input.substring(0, 4));
    if (input.length === 4) {
      document.getElementById('cardNumber4').focus();
    }
  };

  const handleCardNumber4Change = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setCardNumber4(input.substring(0, 4));
  };

  const handleSubmit = () => {
    // Validation logic can be added here before calling handleAddCard
    const cardNumber = cardNumber1 + "-" + cardNumber2 + "-" + cardNumber3 + "-" + cardNumber4;
    const expiryDate = expiryMonth + "/" + expiryYear;
    handleAddCard({ cardNumber, expiryDate, cvv, cardName });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Payment Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
      <Form.Group>
        <Form.Label>Card Number</Form.Label>
        <div style={{ display: 'flex' }}>
          <Form.Control
            type="text"
            maxLength="4"
            placeholder="XXXX"
            value={cardNumber1}
            onChange={handleCardNumber1Change}
          />
          <span> - </span>
          <Form.Control
            type="text"
            maxLength="4"
            placeholder="XXXX"
            value={cardNumber2}
            onChange={handleCardNumber2Change}
            id="cardNumber2"
          />
          <span> - </span>
          <Form.Control
            type="text"
            maxLength="4"
            placeholder="XXXX"
            value={cardNumber3}
            onChange={handleCardNumber3Change}
            id="cardNumber3"
          />
          <span> - </span>
          <Form.Control
            type="text"
            maxLength="4"
            placeholder="XXXX"
            value={cardNumber4}
            onChange={handleCardNumber4Change}
            id="cardNumber4"
          />
        </div>
      </Form.Group>
      <Form.Group controlId="expiryDate">
        <Form.Label>Expiry Date</Form.Label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Control
            type="text"
            maxLength="2"
            pattern="\d{2}"
            placeholder="MM"
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
            required
          />
          <span style={{ margin: '0 5px' }}>/</span>
          <Form.Control
            type="text"
            maxLength="4"
            pattern="\d{4}"
            placeholder="YYYY"
            value={expiryYear}
            onChange={(e) => setExpiryYear(e.target.value)}
            required
          />
        </div>
        <Form.Control.Feedback type="invalid">
          Please enter a valid expiry date in the format MM/YYYY.
        </Form.Control.Feedback>
      </Form.Group>
        <Form.Group controlId="cvv">
          <Form.Label>CVV</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="cardName">
          <Form.Label>Name on Card</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name on card"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />
        </Form.Group>
      </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Add Card</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPaymentCardModal;
