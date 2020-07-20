import React from 'react';
import classNames from 'classnames';

import './App.css';
import Avatar from './Avatar';

const ScrollDirection = {
  UP: -1,
  UNKNOWN: 0,
  DOWN: 1
}

const EdgeStage = {
  NONE: '',
  POPPING: 'popping',
  POPPED: 'popped'
}

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      lastAboveIndex: -1,
      lastBelowIndex: this.props.fields.length,
      initIndex: false,
      onEdgeIndex: -1,
      onEdgeStage: EdgeStage.NONE,
      lastScrollPos: 0,
      scrollDirection: ScrollDirection.UNKNOWN
    }

    this.refRows = []
    for(var i=0; i<this.props.fields.length; i++){
      this.refRows[i] = React.createRef();
    }

    // this.pageRef = React.createRef();
  }

  onIntersectChange = (watching, observer) => {
    if(this.state.initIndex){ //check of index changes
      watching.forEach(row => {
        const indexStr = row.target.getAttribute('data-index');
        console.log(`${indexStr} changed`,row)
        const index = parseInt(indexStr);
        if(row.intersectionRatio === 1){ // shows up in viewport
          if(this.state.lastAboveIndex >= index){
            this.setState({lastAboveIndex : index - 1})
          } else if (this.state.lastBelowIndex <=index){
            this.setState({lastBelowIndex: index + 1 })
          }
        } else if (row.intersectionRatio >= 0.9){
          this.setState({onEdgeIndex: index, onEdgeStage: EdgeStage.POPPED})
        } else if (row.intersectionRatio >= 0.5) { // about to pop into view
          this.setState({onEdgeIndex: index, onEdgeStage: EdgeStage.POPPING})
        }
        else { // hides in viewport
          if(row.boundingClientRect.y < 0){
            this.setState({lastAboveIndex : index})
          } else {
            this.setState({lastBelowIndex: index})
          }
        }
      })
    } else { // init above and below fold indicies
      console.log('init visibility')
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

  onPageScroll = (evt) => {
    this.setState({
      lastScrollPos: evt.target.scrollTop,
      scrollDirection: evt.target.scrollTop > this.state.lastScrollPos ? ScrollDirection.DOWN : ScrollDirection.UP
    })
  }

  componentDidMount() {
    const observer = new IntersectionObserver(this.onIntersectChange, {threshold: [0.5, 0.9, 1.0]})

    this.refRows.forEach((e) => {
      observer.observe(e.current)
    })
  }

  /*
  componentDidUpdate(prevProps, prevState){
    if (this.state.lastAboveIndex !== prevState.lastAboveIndex){

    }
  }
  */


  render() {

  const {fields} = this.props
  const {lastAboveIndex, lastBelowIndex, onEdgeIndex, onEdgeStage, scrollDirection} = this.state

  const renderAvatar = (u) => (<Avatar key={u.name} user={u} />);

  const renderPreviewAvatar = (allow, u) => (<Avatar key={u.name} user={u}
    stage={allow && onEdgeIndex === u.index ? onEdgeStage : null}
  />);

  const aboveUsers = lastAboveIndex !== -1 ? fields.slice(0, lastAboveIndex + 1).map(f => f.on).reverse().flat().map(u => renderPreviewAvatar(scrollDirection === ScrollDirection.UP, u)) : "";
  const belowUsers = lastBelowIndex !== fields.length ? fields.slice(lastBelowIndex).map(f => f.on).flat().map(u => renderPreviewAvatar(scrollDirection === ScrollDirection.DOWN, u)) : ""

  const fieldsView = fields.map( (f, i) => (<div key={i} className="row">
    <label>{f.name}</label>
    <div className={classNames({'presence': true, 'off-screen': i <= lastAboveIndex || i >= lastBelowIndex})}
      data-index={i} ref={this.refRows[i]}>
    {f.on.map(renderAvatar)}</div>
    {f.type === "textarea" ? (<textarea></textarea>) : (<input type="text" />) }
  </div>));


    return (
      <div id="page" onScroll={this.onPageScroll}>
        <div className="above-fold">{aboveUsers}</div>
        <div className="container">{fieldsView}</div>
        <div className="below-fold">{belowUsers}</div>
      </div>
    );
  }
}


export default App;
