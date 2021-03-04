import React from "react";
import ReactDOM from "react-dom";
import App from './App'

// * Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Custom CSS
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);