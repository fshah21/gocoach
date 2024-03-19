import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddPaymentCardModal = ({ show, handleClose, handleAddCard }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const handleSubmit = () => {
    // Validation logic can be added here before calling handleAddCard
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
          <Form.Group controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <Form.Control type="text" placeholder="Enter card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="expiryDate">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control type="text" placeholder="Enter expiry date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="cvv">
            <Form.Label>CVV</Form.Label>
            <Form.Control type="text" placeholder="Enter CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="cardName">
            <Form.Label>Name on Card</Form.Label>
            <Form.Control type="text" placeholder="Enter name on card" value={cardName} onChange={(e) => setCardName(e.target.value)} />
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
