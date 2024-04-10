import React, { useEffect, useState } from 'react';
import { Container, Modal, Row, Col, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import CustomProgressBar from './CustomProgressBar';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [showRateModal, setShowRateModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

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
  }, [classInfo, classDuration, timer]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("FETCH CLASS AND SECTIONS IN CLASS DISPLAY SCREEN");
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
    };
    fetchData();
  }, [])

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
  }, [classInfo, timer, sections]);

  const handleStart = () => {
    setTimer({ hours: 0, minutes: 0, seconds: 0 });
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    handleShowRateModal();
  };

  const calculateRemainingTimeInSection = () => {
    if (currentSection) {
      const currentTimeInSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
      const sectionStartTimeInSeconds = parseInt(currentSection.startTime) * 60;
      const sectionEndTimeInSeconds = parseInt(currentSection.finishTime) * 60;
      
      if (currentTimeInSeconds < sectionStartTimeInSeconds) {
        // If current time is before the section start time
        return sectionStartTimeInSeconds - currentTimeInSeconds;
      } else if (currentTimeInSeconds >= sectionStartTimeInSeconds && currentTimeInSeconds < sectionEndTimeInSeconds) {
        // If current time is within the section
        return sectionEndTimeInSeconds - currentTimeInSeconds;
      }
    }
    return 0; // Default value if no current section or section not started yet
  };
  
  // Calculate the total remaining time for the class
  const calculateTotalRemainingTime = () => {
    const currentTimeInSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
    return classDurationSeconds - currentTimeInSeconds;
  };  

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
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
  
  const handleShowRateModal = () => {
    setShowRateModal(true);
  };

  // Function to handle closing rate modal
  const handleCloseRateModal = () => {
    setShowRateModal(false);
  };

  // Function to handle showing rating modal
  const handleShowRatingModal = () => {
    setShowRateModal(false); // Close rate modal
    setShowRatingModal(true);
  };

  // Function to handle closing rating modal
  const handleCloseRatingModal = async () => {
    setShowRatingModal(false);
    console.log("IN HANDLE START CLICK");
    console.log("USER ID", userId);
    console.log("CLASS ID", classId);
    console.log("STAR INDEX", rating + 1);

    await axios.post(`http://localhost:5000/gocoachbackend/us-central1/backend/classes/saveRating/${classId}`, {
      user_id: userId,
      rating: rating
    });

    navigate('/userhome', { state: { userId: userId } });
  };

  // Function to handle "Yes" click in rate modal
  const handleRateYesClick = () => {
    handleShowRatingModal(); // Show rating modal
  };

  // Function to handle "No" click in rate modal
  const handleRateNoClick = () => {
    handleCloseRateModal(); // Close rate modal
  };

  const handleStarClick = (starIndex) => {
    console.log("HANDLE STAR CLICK");
    setRating(starIndex + 1); // Set the rating value (stars are 1-indexed)
    console.log("IN HANDLE START CLICK");
    console.log("USER ID", userId);
    console.log("CLASS ID", classId);
    console.log("STAR INDEX + 1", starIndex);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsRunning(true);
  };
  
  // In the timer interval useEffect, add a condition to check if the timer is paused
  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        // Timer logic remains the same
      }, 1000);
    }
  
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timer]);


  return (
    <Container>
      <p>Class Display Screen Is Here</p>
      {classId && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '8rem' }}>{`${timer.hours
            .toString()
            .padStart(2, '0')}:${timer.minutes.toString().padStart(2, '0')}:${timer.seconds
            .toString()
            .padStart(2, '0')}`}</p>
          <hr style={{ width: '100%', margin: '20px auto', border: '2px solid black'}} />
          
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
              <Row>
                <Col md={1}>
                  <Button variant="success" onClick={isRunning ? handlePause : handleResume}>
                    {isRunning ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                  </Button>
                </Col>
                <Col md={11}>
                  <CustomProgressBar className="mt-5" sections={sections} classDuration={classDuration} classDurationSeconds={classDurationSeconds} timerSeconds={timerSeconds}/>
                </Col>
              </Row>
              <Row>
                <Col md={6} className='text-left'>
                  <h3>Time Remaining in Section:</h3>
                  <p>{`${Math.floor(calculateRemainingTimeInSection() / 60)} minutes ${calculateRemainingTimeInSection() % 60} seconds`}</p>
                </Col>
                <Col md={6} className='text-left'>
                  <h3>Total Remaining Time:</h3>
                  <p>{`${Math.floor(calculateTotalRemainingTime() / 3600)} hours ${Math.floor((calculateTotalRemainingTime() % 3600) / 60)} minutes ${calculateTotalRemainingTime() % 60} seconds`}</p>
                </Col>
              </Row>
            </div>
          )}
        </div>
      )}

      <Modal show={showRateModal} onHide={handleCloseRateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rate the Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thanks for completing the class. Would you like to rate this class?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRateNoClick}>
            No
          </Button>
          <Button variant="primary" onClick={handleRateYesClick}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for rating */}
      <Modal show={showRatingModal} onHide={handleCloseRatingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rate this Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display star icons and handle their click events */}
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onClick={() => handleStarClick(index)}
              style={{ cursor: 'pointer', marginRight: '5px' }} // Adjust spacing between stars
            >
              {index < rating ? <BsStarFill style={{ fontSize: '24px' }} /> : <BsStar style={{ fontSize: '24px' }} />} {/* Adjust icon size */}
            </span>
          ))}
        </Modal.Body>
        <Modal.Footer>
          {/* You can add buttons or actions related to rating here */}
          <Button variant="secondary" onClick={handleCloseRatingModal}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClassDisplayScreen;