import React from 'react';
import './ProgressBar.css'; // Import the CSS file for styling

const CustomProgressBar = ({ sections, classDuration, classDurationSeconds, timerSeconds, countDirectionCustom }) => {

  console.log("CUSTOM MODE PROGRESS BAR");
  console.log("SECTIONS", sections);
  console.log("CLASS DURATION", classDuration);
  console.log("CLASS DURATION SECONDS", classDurationSeconds);
  console.log("TIMER SECONDS", timerSeconds);
  console.log("COUNT DIRECTION CUSTOM", countDirectionCustom);

  const progressFraction = countDirectionCustom
  ? ((classDurationSeconds - timerSeconds) / classDurationSeconds) * 100
  : (timerSeconds / classDurationSeconds) * 100;
  const gradientColor = `linear-gradient(to right, green 0%, green ${progressFraction}%, #ccc ${progressFraction}%, #ccc 100%)`;

  return (
    <div className="progress-bar-new" style={{ background: gradientColor }}>
      
      {sections.map((section, index) => {
        const sectionWidth = calculateSectionWidth(section.startTime, section.finishTime, classDuration);
       
        return (
          <div
            key={index}
            className={`section`}
            style={{ width: `${sectionWidth}%` }}
          >
            <span className="label">{section.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const calculateSectionWidth = (startTime, finishTime, classDuration) => {
  const totalDuration = finishTime - startTime + 1;
  const widthPercentage = (totalDuration / classDuration) * 100;
  return widthPercentage;
};

export default CustomProgressBar;
