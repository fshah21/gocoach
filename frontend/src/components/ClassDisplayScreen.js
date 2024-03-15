import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import CustomProgressBar from './CustomProgressBar';

const ClassDisplayScreen = () => {
  const userId = useSelector(state => state.user.userId);
  const location = useLocation();
  const classInfo = location.state?.classId;

  // Use state to manage the class variables
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState(null);
  const [classDuration, setClassDuration] = useState(null);
  const [sectionNames, setSectionNames] = useState([]);
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sections, setSections] = useState([]);
  const [classDurationSeconds, setClassDurationSeconds] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false); 
  const [currentSection, setCurrentSection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check if classId is defined
      if (classInfo) {
        // Extract values from the classId object

        if(classDuration) {
          setClassDurationSeconds(classDuration * 60);
          setTimerSeconds((timer.hours * 60 * 60) + (timer.minutes * 60) + timer.seconds)
          setShowProgressBar(true);
        }
      }
    };
  
    fetchData();
  }, [classDuration, timer]);

  useEffect(() => {
    const fetchData = async () => {
      if (classInfo) {
        const { id, name, duration } = classInfo[0];
  
        // Set values as state variables
        setClassId(id);
        setClassName(name);
        setClassDuration(duration);
  
        // Fetch sections for the class
        const sectionsResponse = await axios.get(`http://localhost:5000/gocoachbackend/us-central1/backend/users/${userId}/classes/getAllSectionsInClass/${id}`);
        
        // Extract section names and order them by startTime
        const sortedSectionNames = sectionsResponse.data
          .map((section) => ({
              name: section.name,
              startTime: section.startTime,
              finishTime: section.finishTime,
              displayText: section.displayText,
              coachNotes: section.coachNotes,
          }))
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

      
        setSectionNames(sortedSectionNames);

        const sectionData = sortedSectionNames
        .map((section) => ({
          label: section.name.toUpperCase(), 
          displayText: section.displayText,
          coachNotes: section.coachNotes,
          completed: false,
          startTime: section.startTime,
          finishTime: section.finishTime
        }))

        setSections(sectionData);
      }
    }
  })

  useEffect(() => {
    if (sections.length > 0) {
      const currentMinute = timer.hours * 60 + timer.minutes;
      var currentSectionIndex = sections.findIndex(section =>
        currentMinute >= parseInt(section.startTime) &&
        currentMinute < parseInt(section.finishTime)
      );

      if(currentMinute === 0) {
        currentSectionIndex = 0;
      }

      if (currentSectionIndex !== -1) {
        setCurrentSection(sections[currentSectionIndex]);
      } else {
        setCurrentSection(null);
      }
    }
  }, [timer, sections]);

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
        if (timer.seconds === 59) {
          timer.minutes = timer.minutes + 1;
          timer.seconds = 0;
        } else if (timer.minutes === 59) {
          timer.minutes = 0;
          timer.hours = timer.hours + 1;
        } else if ((timer.hours * 3600 + timer.minutes * 60 + timer.seconds + 1) >= classDurationSeconds) {
          // If the current time exceeds the class duration, stop the timer
          console.log("TIMER IS EXCEEDED");
          handleStop();
          return;
        } else {
          timer.seconds = timer.seconds + 1;
        }
        // Update the timer
        const newTimer = {
          hours: timer.hours,
          minutes: timer.minutes,
          seconds: timer.seconds,
        };
  
        // Calculate progress
        const totalSeconds = classDuration * 60 * 60;
        const currentProgress = (timer.hours * 3600 + timer.minutes * 60 + timer.seconds) / totalSeconds;
        setProgress(currentProgress);
  
        // Update the state
        setTimer(newTimer);
      }, 1000);
    }
  
    return () => clearInterval(interval);
  }, [isRunning, timer, classDuration, classDurationSeconds]);

  return (
    <Container>
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
          
          {showProgressBar && currentSection && ( // Conditional rendering of ProgressBar and Current Section
            <div className='mt-5'>
              <Row>
                <Col md={6} className='text-left'>
                  <h3>{currentSection.label} |</h3>
                </Col>
                <Col md={6}>
                </Col>
              </Row>
              <Row className='mb-5'>
                <Col md={6}>
                  <p>DISPLAY TEXT</p>
                  <p className='text-left'>{currentSection.displayText}</p>
                </Col>
                <Col md={6}>
                  <p>COACHES NOTES</p>
                  <p className='ml-0'>{currentSection.coachNotes}</p>
                </Col>
              </Row>
              <CustomProgressBar className="mt-5" sections={sections} classDuration={classDuration} classDurationSeconds={classDurationSeconds} timerSeconds={timerSeconds}/>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default ClassDisplayScreen;