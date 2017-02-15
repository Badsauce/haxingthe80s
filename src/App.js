import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="nav">
          <ul>
            <li>Home</li>
          </ul>
        </div>
        <img className="headerImage" src="/headerImage.jpg" alt="hackathon 8"/>
      </div>
    );
  }
}

export default App;
