import React from 'react';

import App from './App';

/* frontend hack to users changing the fields they are in */

const fields = [
  { name: "field 0", type: "input-text", on: []},
  { name: "field 1", type: "input-text", on: []},
  { name: "field 2", type: "textarea", on: []},
  { name: "field 3", type: "input-text", on: []},
  { name: "field 4", type: "textarea", on: []},
  { name: "field 5", type: "input-text", on: []},
  { name: "field 6", type: "input-text", on: []},
  { name: "field 7", type: "textarea", on: []},
];

const users = [
  {name: "Buffy", color: "#448AFF"},
  {name: "Willow", color: "#FF3D00"},
  {name: "Xander", color: "#64DD17"},
  {name: "Giles", color: "#FFEA00"},
  {name: "Drusilla", color: "#7C4DFF"},
  {name: "Angel", color: "#64FFDA"},
  {name: "Spike", color: "#FF4081"},
  {name: "Tara", color: "#69F0AE"},
  {name: "Cordelia", color: "#FFAB40"},
  {name: "Faith", color: "#ff1744"},
  {name: "Oz", color: "#18FFFF"}
]

function randomInt(max){
  return Math.floor(Math.random() * max);
}

function createState(){
  var remainingUsers = [...users]
  var data = fields.map(f => {
    const count = randomInt(3);
    const atIndex = randomInt(remainingUsers.length - 1 - count)
    const rmUsers = remainingUsers.splice(atIndex, count)
    f.on = rmUsers
    return f
  })
  return {data, remainingUsers};
}

class Controller extends React.Component {

  // TODO We can also put this in a webworker to not block main thread
  updateState = () => {
    const fieldsToUpdate = randomInt(5);
    console.log(`updating ${fieldsToUpdate} fields`)
    var remainingUsers = [...this.state.remainingUsers]
    var data = [...this.state.data]
    for(var i=0; i<fieldsToUpdate; i++){
      const index = randomInt(data.length)
      if(Math.random() > 0.5){ // coin flip to either add an element or remove
        // add user
        if(remainingUsers.length === 0){ // no more remaining users to add
          continue;
        }
        const newUser = remainingUsers.shift()
        data[index].on.push(newUser)
      } else { // remove user from field
        if(data[index].on.length === 0){ // no users to remove from field
          continue;
        }
        const rmUser = data[index].on.shift()
        remainingUsers.push(rmUser)
      }
    }
    this.setState({data, remainingUsers})
  }

  constructor(props){
    super(props);
    this.state = createState()
  }

  componentDidMount() {
    setInterval(this.updateState, 30000)
  }

  render(){
    return (<App fields={this.state.data} />)
  }
}


export default Controller;