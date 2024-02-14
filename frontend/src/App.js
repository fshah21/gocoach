import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './Navigation';
import { UserProvider } from './components/UserContext';

const App = () => {
  ReactDOM.render(
    <React.StrictMode>
      <UserProvider>
        <Navigation />
      </UserProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

export default App;