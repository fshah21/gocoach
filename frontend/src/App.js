import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './Navigation';
import store from './app/store'
import { Provider } from 'react-redux'  

const App = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

export default App;