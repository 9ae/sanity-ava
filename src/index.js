import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const data = [
  { name: "field 0", type: "input-text", on: [
    {name: "Buffy", color: "#448AFF"}
  ]},
  { name: "field 1", type: "input-text", on: [{name: "Willow", color: "#FF3D00"},{name: "Xander", color: "#64DD17"}]},
  { name: "field 2", type: "textarea", on: []},
  { name: "field 3", type: "input-text", on: [{name: "Giles", color: "#FFEA00"},]},
  { name: "field 4", type: "textarea", on: [{name: "Drusilla", color: "#7C4DFF"},{name: "Angel", color: "#64FFDA"},{name: "Spike", color: "#FF4081"}]},
  { name: "field 5", type: "input-text", on: [{name: "Tara", color: "#69F0AE"}]},
  { name: "field 6", type: "input-text", on: [{name: "Cordelia", color: "#FFAB40"},{name: "Faith", color: "#ff1744"}]},
  { name: "field 7", type: "textarea", on: [{name: "Oz", color: "#18FFFF"}]},
];


ReactDOM.render(
  <React.StrictMode>
    <App fields={data} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
