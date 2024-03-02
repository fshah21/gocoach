import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const ClassDisplayScreen = () => {
  const location = useLocation();
  const classInfo = location.state?.classId;
  console.log("CLASS", classInfo);

  // Use state to manage the class variables
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState(null);
  const [classDuration, setClassDuration] = useState(null);

  useEffect(() => {
    // Check if classId is defined
    if (classInfo) {
      // Extract values from the classId object
      const { id, name, duration } = classInfo[0];

      // Set values as state variables
      setClassId(id);
      setClassName(name);
      setClassDuration(duration);
    }
  }, [classId]);

  return (
    <Container>
      <h2>This is the Class Display Screen</h2>
      {classId && (
        <div style={{ textAlign: 'center' }}>
          {/* <p>Class ID: {classId}</p>
          <p>Class Name: {className}</p>
          <p>Class Duration: {classDuration}</p> */}
          <p style={{ fontSize: '8rem'}}>{classDuration}:00:00</p>
          <hr style={{ width: '100%', margin: '20px auto', border: '2px solid black'}} />
        </div>
      )}
    </Container>
  );
};

export default ClassDisplayScreen;