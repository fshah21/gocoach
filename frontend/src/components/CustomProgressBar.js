import React from 'react';
import './ProgressBar.css'; // Import the CSS file for styling

const CustomProgressBar = ({ sections, classDuration, classDurationSeconds, timerSeconds }) => {
  console.log("IN PROGRESS BAR", sections);
  console.log("CLASS DURATION SECONDS", classDurationSeconds);
  console.log("TIMER SECONDS", timerSeconds);

  return (
    <div className="progress-bar-new">
      {sections.map((section, index) => {
        const sectionWidth = calculateSectionWidth(section.startTime, section.finishTime, classDuration);
        const sectionStartTimeInSeconds = section.startTime * 60; // Convert start time to seconds

        // Calculate the end time in seconds based on class duration
        const sectionEndTimeInSeconds = (section.finishTime * 60) > classDurationSeconds
          ? classDurationSeconds
          : section.finishTime * 60;

        // Calculate the percentage progress of the current section
        const sectionProgress = (timerSeconds - sectionStartTimeInSeconds) / (sectionEndTimeInSeconds - sectionStartTimeInSeconds) * 100;

        // Define color based on progress
        let colorClass = '';
        if (sectionProgress <= 25) {
          colorClass = 'low-progress';
        } else if (sectionProgress <= 75) {
          colorClass = 'medium-progress';
        } else {
          colorClass = 'high-progress';
        }

        return (
          <div
            key={index}
            className={`section ${colorClass}`}
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
