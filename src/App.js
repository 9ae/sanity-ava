import React from 'react';
import classNames from 'classnames';

import './App.css';
import Avatar from './Avatar';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      message: "hey there",
      lastAboveIndex: -1,
      lastBelowIndex: this.props.fields.length,
      initIndex: false, 
      onEdge: []
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
        if(row.intersectionRatio > 0.99){ // shows up in viewport
          if(this.state.lastAboveIndex >= index){
            this.setState({lastAboveIndex : index - 1})
          } else if (this.state.lastBelowIndex <=index){
            this.setState({lastBelowIndex: index + 1 })
          }
        } // TODO add inbetween state
        else { // hides in viewport
          if(row.boundingClientRect.y < 0){
            this.setState({lastAboveIndex : index})
          } else {
            this.setState({lastBelowIndex: index})
          }
        }
      })
    } else { // init above and below fold indicies
      watching.forEach(row => {
        const indexStr = row.target.getAttribute('data-index');
        console.log(`${indexStr} changed`,row)
        if(row.intersectionRatio < 0.99){
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
    console.log('App componentDidMount')
    const observer = new IntersectionObserver(this.onIntersectChange, {threshold: 0.5})

    this.refRows.forEach((e) => {
      observer.observe(e.current)
    })
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.lastAboveIndex !== prevState.lastAboveIndex){

    }
  }


  render() {

  const {fields} = this.props
  const {lastAboveIndex, lastBelowIndex} = this.state

  // TODO throw in its own component?
  const renderAvatar = (u) => (<Avatar key={u.name} user={u} />);

  const aboveUsers = lastAboveIndex !== -1 ? fields.slice(0, lastAboveIndex + 1).map(f => f.on).flat().map(renderAvatar) : "";

  const belowUsers = lastBelowIndex !== fields.length ? fields.slice(lastBelowIndex).map(f => f.on).reverse().flat().map(renderAvatar) : ""

  const fieldsView = fields.map( (f, i) => (<div key={i} className="row">
    <label>{f.name}</label>
    <div className={classNames({'presence': true, 'off-screen': i <= lastAboveIndex || i >= lastBelowIndex})} data-index={i} ref={this.refRows[i]}>{f.on.map(renderAvatar)}</div>
    {f.type === "textarea" ? (<textarea></textarea>) : (<input type="text" />) }
  </div>));
    return (
      <div id="page">
        <div className="above-fold">{aboveUsers}</div>
        <div className="container">{fieldsView}</div>
        <div className="below-fold">{belowUsers}</div>
      </div>
    );
  }
}


export default App;
