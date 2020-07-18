import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      message: "hey there",
      lastAboveIndex: -1,
      lastBelowIndex: this.props.fields.length,
      initIndex: false
    }
    this.refRows = []
    for(var i=0; i<this.props.fields.length; i++){
      this.refRows[i] = React.createRef();
    }
  }

  componentDidMount() {
    const observer = new IntersectionObserver((watching, observer) => {

      if(!this.state.initIndex){
        watching.forEach(row => {
          const indexStr = row.target.getAttribute('data-index');
          console.log(`${indexStr} changed`,row)
          if(!row.isIntersecting){
            const index = parseInt(indexStr);
            if(row.boundingClientRect.y < 0){
              // is above fold
              if(index > this.state.lastAboveIndex){
                this.setState({lastAboveIndex : index})
              }
            } else {
              // is below fold
              if(index < this.state.lastBelowIndex){
                this.setState({lastBelowIndex: index})
              }
            }
          }
        })
        this.setState({initIndex: true})
      } else {
        watching.forEach(row => {
          const indexStr = row.target.getAttribute('data-index');
          console.log(`${indexStr} changed`,row)
            const index = parseInt(indexStr);
            if(row.boundingClientRect.y < 0){
              // is above fold
              if(index !== this.state.lastAboveIndex){
                this.setState({lastAboveIndex : index})
              }
            } else {
              // is below fold
              if(index !== this.state.lastBelowIndex){
                this.setState({lastBelowIndex: index})
              }
            }
          
        })
      }
    }, {threshold: 0.5})

    this.refRows.forEach((e) => {
      observer.observe(e.current)
    })
  }

  render() {
  const fields = this.props.fields.map( (f, i) => (<div key={i} data-index={i} className="row" ref={this.refRows[i]}>
    <label>{f.name}</label>
  <div className="presence">{f.on.map( u => (<div key={u.name} className="avatar" style={{backgroundColor : u.color }}>{u.name.charAt(0)}</div>) )}</div>
    {f.type === "textarea" ? (<textarea></textarea>) : (<input type="text" />) }
  </div>));
    return (
      <div id="page">
        <div className="above-fold">{this.state.lastAboveIndex}</div>
        <div className="container">{fields}</div>
        <div className="below-fold">{this.state.lastBelowIndex}</div>
      </div>
    );
  }
}


export default App;
