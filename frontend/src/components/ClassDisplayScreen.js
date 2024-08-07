import React, { useEffect, useState } from 'react';
import { Container, Modal, Row, Col, Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import CustomProgressBar from './CustomProgressBar';
import CustomModeProgressBar from './CustomModeProgressBar';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { faPlay, faPause, faFastForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import CustomMode from './CustomMode';
import beepSound from './beep.wav';

const ClassDisplayScreen = () => {
  const userId = useSelector(state => state.user.userId);
  const location = useLocation();
  const classInfo = location.state?.classId;
  const beepAudio = new Audio(beepSound);

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
  const [expanded, setExpanded] = useState(false);
  const [displayTextExpanded, setDisplayTextExpanded] = useState(false);
  const [coachNotesExpanded, setCoachNotesExpanded] = useState(false);
  const [timerExpanded, setTimerExpanded] = useState(false);
  const [rounds, setRounds] = useState(1);
  const [timeOnMinutes, setTimeOnMinutes] = useState('');
  const [timeOnSeconds, setTimeOnSeconds] = useState('');
  const [timeOffMinutes, setTimeOffMinutes] = useState('');
  const [timeOffSeconds, setTimeOffSeconds] = useState('');
  const [prepMinutes, setPrepMinutes] = useState('');
  const [prepSeconds, setPrepSeconds] = useState('');
  const [totalWorkoutMinutes, setTotalWorkoutMinutes] = useState('');
  const [totalWorkoutSeconds, setTotalWorkoutSeconds] = useState('');
  const [includeLastReset, setIncludeLastReset] = useState(false);
  const [customTimerValue, setCustomTimerValue] = useState(null); // State to store custom timer value
  const [finalCustomSeconds, setFinalCustomSeconds] = useState('');
  const [customStart, setCustomStart] = useState(false);
  const [customSections, setCustomSections] = useState([]);
  const [customModeEnd, setCustomModeEnd] = useState(false); 
  const [countDirectionCustom, setCountDirectionCustom] = useState(false);
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
      // Play beep sound every time the timer is updated
      beepAudio.play();

      return () => {
        // Clean up audio playback when component unmounts
        beepAudio.pause();
        beepAudio.currentTime = 0;
      };
  }, [timer]); // Trigger effect whenever the timer changes

  useEffect(() => {
    const fetchData = async () => {
      if (classInfo) {
        const { id, name, duration } = classInfo[0];
  
        // Set values as state variables
        setClassId(id);
        setClassName(name);
        setClassDuration(duration);
  
        // Fetch sections for the class
        const sectionsResponse = await axios.get(`https://us-central1-gocoachbackend.cloudfunctions.net/api/api/users/${userId}/classes/getAllSectionsInClass/${id}`);
        
        // Extract section names and order them by startTime
        const sortedSectionNames = sectionsResponse.data
          .map((section) => ({
              name: section.name,
              startTime: section.startTime,
              finishTime: section.finishTime,
              displayText: section.displayText,
              coachNotes: section.coachNotes,
              intervalEnabled: section.intervalEnabled,
              intervalTime: section.intervalTime,
              countDirectionUp: section.countDirectionUp, 
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
          finishTime: section.finishTime,
          intervalEnabled: section.intervalEnabled,
          intervalTime: section.intervalTime,
          countDirectionUp: section.countDirectionUp, 
        }))

        setSections(sectionData);
      }
    };
    fetchData();
  }, [])

  useEffect(() => {
    console.log("IS PRESET MODE TOGGLE", isPresetMode);
    if (isPresetMode && sections.length > 0) {
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
    if(!isPresetMode && customSections.length > 0) {
      console.log("THIS IS IN CUSTOM SECTIONS", customSections);
      const currentSecond = (timer.hours * 3600) + (timer.minutes * 60) + (timer.seconds);
      var currentSectionIndex = customSections.findIndex(section =>
        currentSecond >= parseInt(section.startTime) &&
        currentSecond < parseInt(section.finishTime)
      );

      if(currentSecond === 0) {
        currentSectionIndex = 0;
      }

      if (currentSectionIndex !== -1) {
        setCurrentSection(customSections[currentSectionIndex]);
      } else {
        setCurrentSection(null);
      }
    }

  }, [classInfo, timer, sections, customSections, isPresetMode, customStart]);

  const handleStart = () => {
    setTimer({ hours: 0, minutes: 0, seconds: 0 });
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    if(isPresetMode) {
      handleShowRateModal();
    } else {
      setCustomModeEnd(true);
    }
  };

  const calculateRemainingTimeInSection = () => {
    if (currentSection) {
        const currentTimeInSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
        const sectionStartTimeInSeconds = isPresetMode ? parseInt(currentSection.startTime) * 60 : parseInt(currentSection.startTime);
        const sectionEndTimeInSeconds = isPresetMode ? parseInt(currentSection.finishTime) * 60 : parseInt(currentSection.finishTime);
        if(isPresetMode) {
          if (currentTimeInSeconds < sectionStartTimeInSeconds) {
            // If current time is before the section start time
            return sectionStartTimeInSeconds - currentTimeInSeconds;
          } else if (currentTimeInSeconds >= sectionStartTimeInSeconds && currentTimeInSeconds < sectionEndTimeInSeconds) {
            // If current time is within the section
            return sectionEndTimeInSeconds - currentTimeInSeconds;
          }
        }
        else {
          return (sectionEndTimeInSeconds - sectionStartTimeInSeconds);
        }
    }
    return 0; // Default value if no current section or section not started yet
  };
  
  // Calculate the total remaining time for the class
  const calculateTotalRemainingTime = () => {
    if(isPresetMode) {
      const currentTimeInSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
      return classDurationSeconds - currentTimeInSeconds;
    } else {
      if(countDirectionCustom) {
        const currentTimeInSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
        return finalCustomSeconds - (finalCustomSeconds - currentTimeInSeconds);
      } else {
        const currentTimeInSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
        return finalCustomSeconds - currentTimeInSeconds;
      }
    }
  };  

  useEffect(() => {
    var totalSecondsBasedOnMode = classDurationSeconds;
    if(!isPresetMode) {
      totalSecondsBasedOnMode = finalCustomSeconds;
    }
    let interval;
    if (isRunning && !isPaused && !countDirectionCustom) {
      console.log("COUNT DIRECTION UP IN THE MODE TRUE");
      interval = setInterval(() => {
        if (timer.seconds === 59) {
          timer.minutes = timer.minutes + 1;
          timer.seconds = 0;
        } else if (timer.minutes === 59) {
          timer.minutes = 0;
          timer.hours = timer.hours + 1;
        } else if ((timer.hours * 3600 + timer.minutes * 60 + timer.seconds + 1) > totalSecondsBasedOnMode) {
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

    // count down
    // commented for now
    if (isRunning && !isPaused && !isPresetMode && countDirectionCustom) {
      interval = setInterval(() => {
        if (timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0) {
          // Timer reached zero, stop the timer
          // handleStop();
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
  }, [isRunning, timer, classDuration, classDurationSeconds, currentSection]);
  
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

    await axios.post(`https://us-central1-gocoachbackend.cloudfunctions.net/api/api/classes/saveRating/${classId}`, {
      user_id: userId,
      rating: rating
    });

    navigate('/userhome', { state: { userId: userId } });
  };

  const handleCustomModeEnding = async () => {
    setCustomModeEnd(false);
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
    setRating(starIndex + 1); // Set the rating value (stars are 1-indexed)
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
      const nextSectionStartTime = parseInt(sections[nextSectionIndex].startTime) * 60;
      const currentTimeInSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
      setIsRunning(false);
      setIsPaused(true);
      const remainingTimeInCurrentSection = calculateRemainingTimeInSection();
      const totalRemainingTime = calculateTotalRemainingTime();
      const currentProgress = nextSectionStartTime;
      setProgress(currentProgress);
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
      handlePause();
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
    setTimer({ hours: exerciseHours, minutes: exerciseMinutes, seconds: exerciseSeconds});
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

  const handleExpand = (section) => {
    switch (section) {
      case 'displayText':
        setDisplayTextExpanded(!displayTextExpanded);
        break;
      case 'coachNotes':
        setCoachNotesExpanded(!coachNotesExpanded);
        break;
      case 'timer':
        setTimerExpanded(!timerExpanded);
      default:
        setExpanded(!expanded);
    }
  };

  const expandedStyle = {
    fontSize: displayTextExpanded || coachNotesExpanded ? '3rem' : 'inherit',
  };

  const timerExpandedStyle = {
    fontSize: timerExpanded ? '20rem' : '10rem',
  };

  const calculateTotalWorkoutTime = () => {
    const timeSeconds = (((parseInt(timeOnMinutes) * 60) + parseInt(timeOnSeconds)) + ((parseInt(timeOffMinutes) * 60) + parseInt(timeOffSeconds)));  
    const prepSecondsFinal = (parseInt(prepMinutes) * 60) + parseInt(prepSeconds);
    var totalRoundsSeconds = (rounds * timeSeconds) + prepSecondsFinal;

    if(!includeLastReset) {
      totalRoundsSeconds = totalRoundsSeconds - (((parseInt(timeOffMinutes) * 60) + parseInt(timeOffSeconds)));
    }

    if(countDirectionCustom) {
      const hours = Math.floor(totalRoundsSeconds / 3600); // Whole hours
      const minutes = Math.floor((totalRoundsSeconds % 3600) / 60); // Remaining minutes
      const seconds = totalRoundsSeconds % 60; // Remaining seconds

      setTimer({
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });
    }

    setFinalCustomSeconds(totalRoundsSeconds);
    setCustomStart(true);

    var sectionsInfo = [];

    const prepSection = {
      label: "PREP TIME",
      startTime: 0,
      finishTime: prepSecondsFinal
    }

    sectionsInfo.push(prepSection);

    for (let round = 1; round <= parseInt(rounds); round++) {
      var section = {
        label: "TIME ON",
        startTime: prepSecondsFinal + (round === 1 ? 0 : (round - 1) * timeSeconds),
        finishTime: prepSecondsFinal + (round === 1 ? (parseInt(timeOnMinutes) * 60) + parseInt(timeOnSeconds): (round * timeSeconds) - parseInt(timeOffSeconds))
      }
      sectionsInfo.push(section);

      if(round !== parseInt(rounds)) {
        var timeOffSection = {
          label: "TIME OFF",
          startTime: prepSecondsFinal + (((round - 1) * parseInt(timeSeconds)) + (parseInt(timeOnMinutes) * 60) + parseInt(timeOnSeconds)),
          finishTime: prepSecondsFinal + (round * timeSeconds)
        }
        sectionsInfo.push(timeOffSection);
      }
    }

    if(includeLastReset) {
      var timeOffSection = {
        label: "TIME OFF",
        startTime: prepSecondsFinal + (((rounds - 1) * parseInt(timeSeconds)) + (parseInt(timeOnMinutes) * 60) + parseInt(timeOnSeconds)),
        finishTime: prepSecondsFinal + (rounds * timeSeconds)
      }
      sectionsInfo.push(timeOffSection);
    }

    setCustomSections(sectionsInfo);
    setIsPresetMode(false);
  }

  return (
    <Container fluid className="main-container">
      {classId && (
        <div style={{ textAlign: 'center' }}>
          {!displayTextExpanded && !coachNotesExpanded && (
            <div>
              <p style={{ fontSize: '8rem', ...timerExpandedStyle }} className='timer-style'>{`${timer.hours
                .toString()
                .padStart(2, '0')}:${timer.minutes.toString().padStart(2, '0')}:${timer.seconds
                .toString()
                .padStart(2, '0')}`}
              </p>
              <FontAwesomeIcon
                icon={faExpandArrowsAlt}
                onClick={() => handleExpand('timer')}
                style={{ position: 'absolute', top: '50px', right: '200px', cursor: 'pointer', zIndex: 1 }}
              />
            </div>

          )}
          {!displayTextExpanded && !coachNotesExpanded && !timerExpanded && (
            <hr style={{ width: '70%', margin: '20px auto', border: '2px solid white'}} />
          )}
          
          {!displayTextExpanded && !coachNotesExpanded && !timerExpanded && (
            <div className="d-flex justify-content-center">
            <Form className="d-flex align-items-center">
              <p className="mb-0 mr-2 tag-style"><span>Preset  </span></p>
              <Form.Check
                type="switch"
                id="mode-switch"
                checked={!isPresetMode}
                onChange={() => toggleMode(!isPresetMode)}
              />
              <p className="mb-0 ml-2 tag-style"><span>   Custom</span></p>
            </Form>
            </div>
          )}
          
          <br/>

          {isPresetMode ? (
            <>
          
          {showProgressBar && currentSection && ( // Conditional rendering of ProgressBar and Current Section
            <div className='mt-5'>
              {!displayTextExpanded && !coachNotesExpanded && !timerExpanded && (
                <Row>
                  <Col md={6} className='text-left'>
                    <h3 className='headings'>{currentSection.label}</h3>
                  </Col>
                  <Col md={6}>
                  </Col>
                </Row>
              )}
              <div>
                  <Row className='mb-5'>
                  {!coachNotesExpanded && !timerExpanded && (
                      <Col md={6}>
                        <p className='text-left headings' style={{...expandedStyle}}>DISPLAY TEXT</p>
                        <div style={{ position: 'relative'}}>
                          <textarea
                            readOnly
                            rows={5}
                            style={{ border: 'none', resize: 'none', marginBottom: '10px', width: '100%', ...(displayTextExpanded && { height: 'calc(100vh - 20px)' }), ...expandedStyle }}
                            className='text-left textareabg'
                          >
                            {currentSection.displayText}
                          </textarea>
                          <FontAwesomeIcon
                            icon={faExpandArrowsAlt}
                            onClick={() => handleExpand('displayText')}
                            style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', zIndex: 1, color: '#b3b3b3' }}
                          />
                        </div>
                        </Col>
                    )}
                    {!displayTextExpanded && !timerExpanded && (
                      <Col md={6}>
                        <p className='text-left headings' style={{...expandedStyle}}>COACHES NOTES</p>
                        <div style={{ position: 'relative' }}>
                          <textarea
                            readOnly
                            rows={5}
                            style={{ border: 'none', resize: 'none', marginBottom: '10px', width: '100%', ...(coachNotesExpanded && { height: 'calc(100vh - 20px)' }), ...expandedStyle }}
                            className='text-left textareabg'
                          >
                            {currentSection.coachNotes}
                          </textarea>
                          <FontAwesomeIcon
                            icon={faExpandArrowsAlt}
                            onClick={() => handleExpand('coachNotes')}
                            style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', zIndex: 1, color: '#b3b3b3'}}
                          />
                        </div>
                      </Col>
                    )}
                  </Row>
              </div>
              {!displayTextExpanded && !coachNotesExpanded && !timerExpanded && (
                <Row className="align-items-center m-5">
                  <Col md={1}>
                    <Button onClick={isRunning ? handlePause : handleResume} className='buttons' style={{ marginRight: '10px' }}>
                      {isRunning ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                    </Button>
                    <Button onClick={handleSkipSection} className='buttons'>
                      <FontAwesomeIcon icon={faFastForward} />
                    </Button>
                  </Col>
                  <Col md={8}>
                    <CustomProgressBar className="mt-5" sections={sections} classDuration={classDuration} classDurationSeconds={classDurationSeconds} timerSeconds={timerSeconds}/>
                  </Col>
                  <Col md={3}>
                    <div className="border p-3">
                      <Row>
                        <Col>
                          <p className='mb-0 headings'>TIME REMAINING - SECTION</p>
                          <p className='headings'>{`${Math.floor(calculateRemainingTimeInSection() / 3600).toString().padStart(2, '0')}:${Math.floor((calculateRemainingTimeInSection() % 3600) / 60).toString().padStart(2, '0')}:${(calculateRemainingTimeInSection() % 60).toString().padStart(2, '0')}`}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p className='mb-0 headings'>TIME REMAINING - CLASS</p>
                          <p className='mb-0 headings'>{`${Math.floor(calculateTotalRemainingTime() / 3600)}:${Math.floor((calculateTotalRemainingTime() % 3600) / 60).toString().padStart(2, '0')}:${(calculateTotalRemainingTime() % 60).toString().padStart(2, '0')}`}</p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          )}
            </>
          ) : (
            <>
              <Container fluid className="mt-5">
                {!customStart && !timerExpanded && (
                  <Row className="justify-content-center">
                    <Col md={6}>
                      <Form>
                        <Form.Group controlId="rounds" className="d-flex align-items-center mt-3">
                          <Row>
                            <Col md={9}>
                              <Form.Label className="headings">Number of Rounds</Form.Label>
                            </Col>
                            <Col md={3}>
                              <Form.Control type="number" value={rounds} onChange={(e) => setRounds(e.target.value)} />
                            </Col>
                          </Row>
                        </Form.Group>

                        <Form.Group controlId="timeOn" className="d-flex align-items-center mt-3">
                          <Row>
                            <Col md={6}>
                              <Form.Label className="headings">Time On (MM:SS)</Form.Label>
                            </Col>
                            <Col md={6}>
                              <Row>
                                <Col md={6}>
                                  <Form.Control type="number" placeholder="Minutes" value={timeOnMinutes} onChange={(e) => setTimeOnMinutes(e.target.value)} />
                                </Col>
                                <Col md={6}>
                                  <Form.Control type="number" placeholder="Seconds" value={timeOnSeconds} onChange={(e) => setTimeOnSeconds(e.target.value)} />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Form.Group>

                        <Form.Group controlId="timeOff" className="d-flex align-items-center mt-3">
                          <Row>
                            <Col md={6}>
                              <Form.Label className="headings">Time Off (MM:SS)</Form.Label>
                            </Col>
                            <Col md={6}>
                              <Row>
                                <Col md={6}>
                                  <Form.Control type="number" placeholder="Minutes" value={timeOffMinutes} onChange={(e) => setTimeOffMinutes(e.target.value)} />
                                </Col>
                                <Col md={6}>
                                  <Form.Control type="number" placeholder="Seconds" value={timeOffSeconds} onChange={(e) => setTimeOffSeconds(e.target.value)} />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Form.Group>

                        <Form.Group controlId="prepTime" className="d-flex align-items-center mt-3">
                          <Row>
                            <Col md={6}>
                              <Form.Label className="headings">Prep Time (MM:SS)</Form.Label>
                            </Col>
                            <Col md={6}>
                              <Row>
                                <Col md={6}>
                                  <Form.Control type="number" placeholder="Minutes" value={prepMinutes} onChange={(e) => setPrepMinutes(e.target.value)} />
                                </Col>
                                <Col md={6}>
                                  <Form.Control type="number" placeholder="Seconds" value={prepSeconds} onChange={(e) => setPrepSeconds(e.target.value)} />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Form.Group>

                        {/* <Form.Group controlId="totalWorkoutTime" className="d-flex align-items-center mt-3">
                          <Row>
                            <Col md={6}>
                              <Form.Label>Total Workout Time</Form.Label>
                            </Col>
                            <Col md={6}>
                              <Row>
                                <Col md={6}>
                                  <Form.Control type="number" placeholder="Minutes" value={totalWorkoutMinutes} onChange={(e) => setTotalWorkoutMinutes(e.target.value)} />
                                </Col>
                                <Col md={6}>
                                  <Form.Control type="number" placeholder="Seconds" value={totalWorkoutSeconds} onChange={(e) => setTotalWorkoutSeconds(e.target.value)} />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Form.Group> */}

                        <Form.Group controlId="countDirectionCustom" className="d-flex align-items-center mt-3">
                          <div className="d-flex align-items-center">
                            <p  style={{ marginLeft: "80px"}} className='mt-3 headings'><span>Count Up  </span></p>
                            <Form.Check style={{ marginLeft: "178px"}} type="switch" checked={countDirectionCustom} onChange={(e) => setCountDirectionCustom(e.target.checked)} />
                            <p className='mt-3 headings' style={{ marginLeft: "80px"}}><span>   Count Down</span></p>
                          </div>
                        </Form.Group>

                        <Form.Group controlId="includeLastReset" className="d-flex align-items-center mt-3">
                          <Row>
                            <Col md={11}>
                              <Form.Label className="mx-5 headings">Include Last Rest</Form.Label>
                            </Col>
                            <Col md={1}>
                              <Form.Check className="mx-3" type="switch" checked={includeLastReset} onChange={(e) => setIncludeLastReset(e.target.checked)} />
                            </Col>
                          </Row>
                        </Form.Group>

                        <Button onClick={calculateTotalWorkoutTime} className="ml-auto mt-4 buttons">Start</Button>
                      </Form>
                    </Col>
                  </Row>
                )}
                {customStart && !timerExpanded && (
                  <Row className="align-items-center m-5">
                  <Col md={1}>
                    <Button onClick={isRunning ? handlePause : handleResume} className='buttons'>
                      {isRunning ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                    </Button>
                  </Col>
                  <Col md={8}>
                    <CustomModeProgressBar className="mt-5" sections={customSections} classDuration={finalCustomSeconds} classDurationSeconds={finalCustomSeconds} timerSeconds={timerSeconds} countDirectionCustom={countDirectionCustom}/>
                  </Col>
                  <Col md={3}>
                    <div className="border p-3">
                      <Row>
                        <Col>
                          <p className='mb-0 headings'>TIME REMAINING - SECTION</p>
                          <p className='headings'>{`${Math.floor(calculateRemainingTimeInSection() / 3600).toString().padStart(2, '0')}:${Math.floor((calculateRemainingTimeInSection() % 3600) / 60).toString().padStart(2, '0')}:${(calculateRemainingTimeInSection() % 60).toString().padStart(2, '0')}`}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p className='mb-0 headings'>TIME REMAINING - CLASS</p>
                          <p className='mb-0 headings'>{`${Math.floor(calculateTotalRemainingTime() / 3600)}:${Math.floor((calculateTotalRemainingTime() % 3600) / 60).toString().padStart(2, '0')}:${(calculateTotalRemainingTime() % 60).toString().padStart(2, '0')}`}</p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                )}
              </Container>
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

      <Modal show={customModeEnd} onHide={handleCustomModeEnding}>
        <Modal.Header closeButton>
          <Modal.Title>Yay!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your workout has ended. Thank you!
          </p>
        </Modal.Body>
        <Modal.Footer>
          {/* You can add buttons or actions related to rating here */}
          <Button variant="secondary" onClick={handleCustomModeEnding}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClassDisplayScreen;