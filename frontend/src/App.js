import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './Navigation';

const App = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Navigation />
    </React.StrictMode>,
    document.getElementById('root')
  );
};

export default App;