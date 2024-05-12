import React from 'react';
import './App.css';
import Body from './components/Body';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="App">
      <Body/>
      <Toaster/>
    </div>
  );
}

export default App;