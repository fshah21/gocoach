import React from 'react';
import './ProgressBar.css'; // Import the CSS file for styling

const CustomProgressBar = ({ sections, classDuration, classDurationSeconds, timerSeconds }) => {
  const progressFraction = (timerSeconds / classDurationSeconds) * 100;
  const gradientColor = `linear-gradient(to right, green 0%, green ${progressFraction}%, #ccc ${progressFraction}%, #ccc 100%)`;

  return (
    <div className="progress-bar-new" style={{ background: gradientColor }}>
      
      {sections.map((section, index) => {
        const sectionWidth = calculateSectionWidth(section.startTime, section.finishTime, classDuration);
        console.log("SECTION IN CUSTOM PROGRESS BAR", section);
        console.log("SECTION WIDTH IN CUSTOM PROGRESS BAR", sectionWidth);
        return (
          <div key={index} className="section" style={{ width: `${sectionWidth}%`, position: 'relative' }}>
            <span className="label" style={{ textAlign: 'center', zIndex: 2 }}>{section.label}</span>
            {section.intervalEnabled && (
              <div style={{ position: 'absolute', marginTop: '-25px', width: '100%', height: '100%' }}>
                {renderIntervals(section, sectionWidth)}
              </div>
            )}
        </div>
        );
      })}
    </div>
  );
};

const calculateSectionWidth = (startTime, finishTime, classDuration) => {
  console.log("CLASS DURATION", classDuration);
  console.log("START TIME", startTime);
  console.log("FINISH TIME", finishTime);
  const totalDuration = finishTime - startTime;
  console.log("TOTAL DURATION", totalDuration);
  const widthPercentage = (totalDuration / classDuration) * 100;
  console.log("WIDTH PERCENTAGE", widthPercentage);
  return widthPercentage;
};

const parseTimeToSeconds = (timeString) => {
  let parts = timeString.split(':').map(part => parseInt(part, 10));
  let seconds = 0;
  if (parts.length === 3) {
      // Format HH:MM:SS
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
      // Format MM:SS
      seconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
      // Format SS
      seconds = parts[0];
  }
  return seconds;
};

const renderIntervals = (section, sectionWidth) => {
  const totalDuration = section.finishTime - section.startTime;
  const intervalSeconds = parseTimeToSeconds(section.intervalTime);
  const numberOfIntervals = Math.ceil(totalDuration * 60 / intervalSeconds);
  const intervalWidth = (intervalSeconds / (totalDuration * 60)) * 100;

  console.log("SECTION", section);
  console.log("SECTION WIDTH", sectionWidth);
  console.log("TOTAL DURATION", totalDuration);
  console.log("INTERVAL SECONDS", intervalSeconds);
  console.log("NUMBER OF INTERVALS", numberOfIntervals);
  console.log("INTERVAL WIDTH", intervalWidth);

  return [...Array(numberOfIntervals).keys()].map(intervalIndex => (
    <div key={intervalIndex} 
        style={{
          display: 'inline-block',
          width: `${intervalWidth}%`,
          borderRight: intervalIndex === numberOfIntervals - 1 ? 'none' : '2px solid #000', // no border on the last interval
          boxSizing: 'border-box',
          height: '100%', // Ensure the div fills the parent's height
          zIndex: 1
        }}>
    </div>
    
  ));
};

export default CustomProgressBar;
