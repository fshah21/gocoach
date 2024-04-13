import React, { useEffect, useState } from 'react';
import { Container, Modal, Row, Col, Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import CustomProgressBar from './CustomProgressBar';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomMode from './CustomMode';

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
  const [isPresetMode, setIsPresetMode] = useState(true);
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [isRunningCustom, setIsRunningCustom] = useState(false);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [exerciseHours, setExerciseHours] = useState(0);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [exerciseSeconds, setExerciseSeconds] = useState(0);
  const [customTimerValue, setCustomTimerValue] = useState(null); // State to store custom timer value
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
    if (isRunning && !isPaused && isPresetMode) {
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

    if (isRunning && !isPaused && !isPresetMode) {
      interval = setInterval(() => {
        if (timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0) {
          // Timer reached zero, stop the timer
          handleStop();
          return;
        }
        if (timer.seconds === 0) {
          if (timer.minutes === 0 && timer.hours > 0) {
            // Decrease hours and reset minutes and seconds
            timer.hours = timer.hours - 1;
            timer.minutes = 59;
            timer.seconds = 59;
          } else if (timer.minutes > 0) {
            // Decrease minutes and reset seconds
            timer.minutes = timer.minutes - 1;
            timer.seconds = 59;
          }
        } else {
          // Decrease seconds
          timer.seconds = timer.seconds - 1;
        }
        
        // Update the timer
        const newTimer = {
          hours: timer.hours,
          minutes: timer.minutes,
          seconds: timer.seconds,
        };
    
        // Calculate progress
        const totalSeconds = classDuration * 60 * 60;
        const remainingSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
        const currentProgress = remainingSeconds / totalSeconds;
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

  const handleSkipSection = () => {
    // Find the index of the current section in the sections array
    const currentSectionIndex = sections.findIndex(section => section === currentSection);
  
    // Check if there's a next section
    const nextSectionIndex = currentSectionIndex + 1;
    if(nextSectionIndex === sections.length) {
      setTimer({
        hours: Math.floor(classDurationSeconds / 3600),
        minutes: Math.floor((classDurationSeconds % 3600) / 60),
        seconds: classDurationSeconds % 60
      });
    }

    if (nextSectionIndex < sections.length) {
      // Calculate the time remaining until the next section's start time
      const nextSectionStartTime = parseInt(sections[nextSectionIndex].startTime) * 60;
      console.log("NEXT SECTION START TIME", nextSectionStartTime);
      const currentTimeInSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
      console.log("CURRENT TIME IN SECONDS", currentTimeInSeconds);
      // const timeUntilNextSection = nextSectionStartTime - currentTimeInSeconds;
      // console.log("TIME UNTIL NEXT SECTION", timeUntilNextSection);
  
      // Pause the timer until the next section's start time
      setIsRunning(false);
      setIsPaused(true);
  
      // Update the time remaining in the current section
      const remainingTimeInCurrentSection = calculateRemainingTimeInSection();
      console.log("REMAINING TIME IN CURRENT SECTION", remainingTimeInCurrentSection);
      // Calculate the remaining time for the overall class
      const totalRemainingTime = calculateTotalRemainingTime();
      console.log("TOTAL REMAINING TIME", totalRemainingTime);
  
      // Update the progress bar
      const currentProgress = nextSectionStartTime;
      console.log("CURRENT PROGRESS", currentProgress);
      setProgress(currentProgress);
  
      // Update the state with the new current section and remaining times
      setCurrentSection(sections[nextSectionIndex]);
      setTimer({
        hours: Math.floor(nextSectionStartTime / 3600),
        minutes: Math.floor((nextSectionStartTime % 3600) / 60),
        seconds: nextSectionStartTime % 60
      });
    }
  };

  const toggleMode = () => {
    setIsPresetMode(prevMode => !prevMode);
    if (isPresetMode) {
      // Store the current timer value when switching to custom mode
      setCustomTimerValue({ ...timer });
      setTimer({ hours: 0, minutes: 0, seconds: 0 });
      handlePause(); // Pause the timer when switching to custom mode
    } else {
      if (customTimerValue) {
        // If there's a stored timer value, use it when switching back to preset mode
        setTimer({ ...customTimerValue });
      }
    }
  };

  const handleStartCustom = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseCustom = () => {
    setIsRunning(false);
  };

  const handleResetCustom = () => {
    setIsRunning(false);
    setTimeInSeconds(0);
  };

  const handleChangeExerciseTime = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setExerciseTime(value);
    }
  };

  const handleStartExercise = () => {
    setTimer({ hours: exerciseHours, minutes: exerciseMinutes, seconds: exerciseSeconds});
  };

  const handleChangeExerciseHours = (event) => {
    setExerciseHours(parseInt(event.target.value));
  };

  const handleChangeExerciseMinutes = (event) => {
    setExerciseMinutes(parseInt(event.target.value));
  };

  const handleChangeExerciseSeconds = (event) => {
    setExerciseSeconds(parseInt(event.target.value));
  };

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

          <div className="d-flex justify-content-center">
            <Form className="d-flex align-items-center">
              <p className="mb-0 mr-2"><span>Preset  </span></p>
              <Form.Check
                type="switch"
                id="mode-switch"
                checked={!isPresetMode}
                onChange={() => toggleMode(!isPresetMode)}
              />
              <p className="mb-0 ml-2"><span>   Custom</span></p>
            </Form>
          </div>
          
          <br/>

          {isPresetMode ? (
            <>
            <Button variant="success" onClick={handleSkipSection} className='mt-3'>
            Skip This Section
          </Button>
          
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
                  <p  className='text-left'>DISPLAY TEXT</p>
                  <textarea readOnly rows={3} style={{ border: 'none', resize: 'none', marginBottom: '10px' }} className='text-left'>{currentSection.displayText}</textarea>
                </Col>
                <Col md={6}>
                  <p  className='text-left'>COACHES NOTES</p>
                  <textarea readOnly rows={3} style={{ border: 'none', resize: 'none', marginBottom: '10px' }}  className='text-left'>{currentSection.coachNotes}</textarea>
                </Col>
              </Row>
              <Row className="align-items-center">
              <Col md={1}>
                <Button variant="success" onClick={isRunning ? handlePause : handleResume}>
                  {isRunning ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </Button>
              </Col>
              <Col md={8}>
                <CustomProgressBar className="mt-5" sections={sections} classDuration={classDuration} classDurationSeconds={classDurationSeconds} timerSeconds={timerSeconds}/>
              </Col>
              <Col md={3}>
                <div className="border p-3">
                  <Row>
                    <Col>
                      <p className='mb-0'>Time Remaining in Section</p>
                      <p>{`${Math.floor(calculateRemainingTimeInSection() / 3600).toString().padStart(2, '0')}:${Math.floor((calculateRemainingTimeInSection() % 3600) / 60).toString().padStart(2, '0')}:${(calculateRemainingTimeInSection() % 60).toString().padStart(2, '0')}`}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p className='mb-0'>Remaining Time</p>
                      <p className='mb-0'>{`${Math.floor(calculateTotalRemainingTime() / 3600)}:${Math.floor((calculateTotalRemainingTime() % 3600) / 60).toString().padStart(2, '0')}:${(calculateTotalRemainingTime() % 60).toString().padStart(2, '0')}`}</p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            </div>
          )}
            </>
          ) : (
            <>
              <div className='mt-5'>
                <label htmlFor="exerciseHours">Hours: </label>
                <input type="number" id="exerciseHours" value={exerciseHours} onChange={handleChangeExerciseHours} />
                <label htmlFor="exerciseMinutes">Minutes: </label>
                <input type="number" id="exerciseMinutes" value={exerciseMinutes} onChange={handleChangeExerciseMinutes} />
                <label htmlFor="exerciseSeconds">Seconds: </label>
                <input type="number" id="exerciseSeconds" value={exerciseSeconds} onChange={handleChangeExerciseSeconds} />
                <button onClick={handleStartExercise}>Set Timer</button>
              </div>
              <div>
                <button onClick={handleStartCustom}>Start</button>
                <button onClick={handlePauseCustom}>Pause</button>
                <button onClick={handleResetCustom}>Reset</button>
              </div>
            </>
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