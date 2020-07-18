import React from 'react';
import './App.css';

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

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      fields: data,
      message: "hey there",
      userColorMaps: {}
    }
  }

  render() {
  const fields = this.state.fields.map(f => (<div class="row">
    <label>{f.name}</label>
  <div class="presence">{f.on.map( u => (<div class="avatar" style={{backgroundColor : u.color }}>{u.name.charAt(0)}</div>) )}</div>
    {f.type === "textarea" ? (<textarea></textarea>) : (<input type="text" />) }
  </div>));
    return (<div class="container">{fields}</div>);
  }
}


export default App;
