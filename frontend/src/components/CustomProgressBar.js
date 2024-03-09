import React from 'react';
import './ProgressBar.css'; // Import the CSS file for styling

const CustomProgressBar = ({ sections }) => {
  console.log("IN PROGRESS BAR", sections);


  return (
    <div className="progress-bar">
      {sections.map((section, index) => (
        <div key={index} className={`section ${section.completed ? 'completed' : ''}`}>
          <span className="label">{section.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomProgressBar;
