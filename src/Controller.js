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
  {name: "Buffy", color: "#4bc7eb", img: "avatar_01.png", index:-1},
  {name: "Willow", color: "#a3e5d9", img: "avatar_02.png", index:-1},
  {name: "Xander", color: "#6dccb8", img: "avatar_03.png", index:-1},
  {name: "Giles", color: "#49c8eb", img: "avatar_04.png", index:-1},
  {name: "Drusilla", color: "#ea5cbe", img: "avatar_05.png", index:-1},
  {name: "Angel", color: "#8bc7eb", img: "avatar_06.png", index:-1},
  {name: "Spike", color: "#7f6892", img: "avatar_07.png", index:-1},
  {name: "Tara", color: "#a674a5", img: "avatar_08.png", index:-1},
  {name: "Cordelia", color: "#ec6d4a", img: "avatar_09.png", index:-1},
  {name: "Faith", color: "#9994d4", img: "avatar_10.png", index:-1},
  {name: "Oz", color: "#fd8103", img: "avatar_11.png", index:-1}
]

function randomInt(max){
  return Math.floor(Math.random() * max);
}

function createState(){
  var remainingUsers = [...users]
  var data = fields.map((f, index) => {
    const count = randomInt(3);
    const atIndex = randomInt(remainingUsers.length - 1 - count)
    const rmUsers = remainingUsers.splice(atIndex, count).map(u => ({...u, index}))
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
        newUser.index = index
        data[index].on.push(newUser)
      } else { // remove user from field
        if(data[index].on.length === 0){ // no users to remove from field
          continue;
        }
        const rmUser = data[index].on.shift()
        rmUser.index = -1;
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
    setInterval(this.updateState, 45000)
  }

  render(){
    return (<App fields={this.state.data} />)
  }
}


export default Controller;