import React, { useEffect, useState } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import CustomProgressBar from './CustomProgressBar';

const ClassDisplayScreen = () => {
  const userId = useSelector(state => state.user.userId);
  const location = useLocation();
  const classInfo = location.state?.classId;
  console.log("CLASS", classInfo);

  // Use state to manage the class variables
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState(null);
  const [classDuration, setClassDuration] = useState(null);
  const [sectionNames, setSectionNames] = useState([]);
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Check if classId is defined
      console.log("STARTING HERE");
      if (classInfo) {
        // Extract values from the classId object
        const { id, name, duration } = classInfo[0];
  
        // Set values as state variables
        setClassId(id);
        setClassName(name);
        setClassDuration(duration);
  
        console.log("SET SECTIONS");
        // Fetch sections for the class
        const sectionsResponse = await axios.get(`http://localhost:5000/gocoachbackend/us-central1/backend/users/${userId}/classes/getAllSectionsInClass/${id}`);
        
        // Extract section names and order them by startTime
        const sortedSectionNames = sectionsResponse.data
          .map((section) => ({
              name: section.name,
              startTime: section.startTime,
              finishTime: section.finishTime,
          }))
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

      
        console.log("SORTED SECTION NAMES", sortedSectionNames);

        setSectionNames(sortedSectionNames);

        const sectionData = sortedSectionNames
        .map((section) => ({
          label: section.name,  // Use 'label' to match the expected structure
          completed: false,  // Set 'completed' based on your logic
        }))

        console.log("SET SECTIONS AFTER GETTING NAMES", sectionData);
        setSections(sectionData);

      }
    };
  
    fetchData();
  }, [classInfo]);

  const handleStart = () => {
    setTimer({ hours: 0, minutes: 0, seconds: 0 });
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {

        if(timer.seconds === 59) {
            timer.minutes = timer.minutes + 1;
            timer.seconds = 0;
        } else if(timer.minutes === 59) {
            timer.minutes = 0;
            timer.hours = timer.hours + 1;
        }
        // Update the timer
        const newTimer = {
          hours: timer.hours,
          minutes: timer.minutes,
          seconds: timer.seconds + 1,
        };
  
        // Calculate progress
        const totalSeconds = classDuration * 60 * 60;
        const currentProgress =
          (timer.hours * 3600 + timer.minutes * 60 + timer.seconds + 1) / totalSeconds;
        setProgress(currentProgress);
  
        // Update the state
        setTimer(newTimer);
      }, 1000);
    }
  
    return () => clearInterval(interval);
  }, [isRunning, timer, classDuration]);

  return (
    <Container>
      <h2>This is the Class Display Screen</h2>
      {classId && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '8rem' }}>{`${timer.hours
            .toString()
            .padStart(2, '0')}:${timer.minutes.toString().padStart(2, '0')}:${timer.seconds
            .toString()
            .padStart(2, '0')}`}</p>
          <hr style={{ width: '100%', margin: '20px auto', border: '2px solid black'}} />

          {!isRunning ? (
            <Button variant="success" onClick={handleStart}>
              Start
            </Button>
          ) : (
            <Button variant="danger" onClick={handleStop}>
              Stop
            </Button>
          )}
          
          <div>
            <h1>Progress Bar</h1>
            <CustomProgressBar sections={sections} />
          </div>
        </div>
      )}
    </Container>
  );
};

export default ClassDisplayScreen;