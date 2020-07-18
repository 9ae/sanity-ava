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

  onIntersectChange = (watching, observer) => {
    if(this.state.initIndex){ //check of index changes
      watching.forEach(row => {
        const indexStr = row.target.getAttribute('data-index');
        console.log(`${indexStr} changed`,row)
          const index = parseInt(indexStr);
          if(row.boundingClientRect.y < 0){ // is above fold
            if(row.isIntersecting){
              this.setState({lastAboveIndex : index - 1})
            } else {
              this.setState({lastAboveIndex: index})
            }
          } else { // is below fold
              if(row.isIntersecting){ // row is now within view,
                this.setState({lastBelowIndex: index + 1 })
              } else {
                this.setState({lastBelowIndex: index})
              }
              
          }
        
      })
    } else { // init above and below fold indicies
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
    }
  }

  componentDidMount() {
    const observer = new IntersectionObserver(this.onIntersectChange, {threshold: 0.8})

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
