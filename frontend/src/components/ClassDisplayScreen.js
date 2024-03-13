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
  const [classDurationSeconds, setClassDurationSeconds] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false); 
  const [currentSection, setCurrentSection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check if classId is defined
      console.log("STARTING HERE");
      if (classInfo) {
        // Extract values from the classId object
        const { id, name, duration } = classInfo[0];

        console.log("CLASS INFO", classInfo);
  
        // Set values as state variables
        setClassId(id);
        setClassName(name);
        setClassDuration(duration);
  
        console.log("SET SECTIONS");
        // Fetch sections for the class
        const sectionsResponse = await axios.get(`http://localhost:5000/gocoachbackend/us-central1/backend/users/${userId}/classes/getAllSectionsInClass/${id}`);
        
        console.log("SECTIONS RESPONSE", sectionsResponse);
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

      
        console.log("SORTED SECTION NAMES", sortedSectionNames);

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

        console.log("SET SECTIONS AFTER GETTING NAMES NEWEST", sectionData);
        setSections(sectionData);

        if(classDuration) {
          console.log("CLASS DURATION IN MAIN", classDuration * 60);
          console.log("TIMER SECONDS", (timer.hours * 60 * 60) + (timer.minutes * 60) + timer.seconds)
          setClassDurationSeconds(classDuration * 60);
          setTimerSeconds((timer.hours * 60 * 60) + (timer.minutes * 60) + timer.seconds)
          setShowProgressBar(true);
        }
      }
    };
  
    fetchData();
  }, [classDuration, timer]);

  useEffect(() => {
    if (sections.length > 0) {
      console.log("SECTIONS LENGTH > 0");
      console.log("TIMER", timer);
      const currentMinute = timer.hours * 60 + timer.minutes;
      console.log("CURRENT MINUTES", currentMinute);

      var currentSectionIndex = sections.findIndex(section =>
        currentMinute >= parseInt(section.startTime) &&
        currentMinute < parseInt(section.finishTime)
      );

      if(currentMinute === 0) {
        currentSectionIndex = 0;
      }

      console.log("CURRENT SECTION INDEX", currentSectionIndex);

      if (currentSectionIndex !== -1) {
        console.log("CURRENT SECTION INFO", sections[currentSectionIndex]);
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