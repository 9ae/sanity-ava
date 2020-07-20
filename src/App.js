import React from 'react';
import classNames from 'classnames';

import './App.css';
import Avatar from './Avatar';
import FoldPreview from './FoldPreview';

const ScrollDirection = {
  UP: -1,
  UNKNOWN: 0,
  DOWN: 1
}

const EdgeStage = {
  NONE: '',
  POPPING: 'popping', // about to appear if you keep scrolling in the same direction. overlap > 50%
  POPPED: 'popped' // most likely going to appear. overlap > 90%
}

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      // Keeps track of field above/below fold
      lastAboveIndex: -1,
      lastBelowIndex: this.props.fields.length,
      initIndex: false,

      // Field that are about to be visible
      edgeIndex: -1,
      edgeStage: EdgeStage.NONE,

      // Scroll tracker to keep track of scroll direction
      lastScrollPos: 0,
      scrollDirection: ScrollDirection.UNKNOWN
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
        if(row.intersectionRatio === 1){ // shows up in viewport
          if(this.state.lastAboveIndex >= index){
            this.setState({lastAboveIndex : index - 1})
          } else if (this.state.lastBelowIndex <=index){
            this.setState({lastBelowIndex: index + 1 })
          }
        } else if (row.intersectionRatio >= 0.8){
          this.setState({edgeIndex: index, edgeStage: EdgeStage.POPPED})
        } else if (row.intersectionRatio >= 0.5) { // about to pop into view
          this.setState({edgeIndex: index, edgeStage: EdgeStage.POPPING})
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
    const observer = new IntersectionObserver(this.onIntersectChange, {threshold: [0.5, 0.8, 1.0]})

    this.refRows.forEach((e) => {
      observer.observe(e.current)
    })
  }

  render() {

  const {fields} = this.props
  const {lastAboveIndex, lastBelowIndex, edgeIndex, edgeStage, scrollDirection} = this.state

  const renderAvatar = (u) => (<Avatar key={u.name} user={u} />);

  const fieldsView = fields.map( (f, i) => (<div key={i} className="row">
    <label>{f.name}</label>
    <div className={classNames({'presence': true, 'off-screen': i <= lastAboveIndex || i >= lastBelowIndex})}
      data-index={i} ref={this.refRows[i]}>
    {f.on.map(renderAvatar)}</div>
    {f.type === "textarea" ? (<textarea></textarea>) : (<input type="text" />) }
  </div>));


    return (
      <div id="page" onScroll={this.onPageScroll}>
        { lastAboveIndex !== -1 && <FoldPreview
          placement="above"
          active={scrollDirection === ScrollDirection.UP}
          edgeIndex={edgeIndex}
          edgeStage={edgeStage}
          users={fields.slice(0, lastAboveIndex + 1).map(f => f.on).reverse().flat()}
        /> }
        <div className="container">{fieldsView}</div>
        { lastBelowIndex !== fields.length && <FoldPreview
          placement="below"
          active={scrollDirection === ScrollDirection.DOWN}
          edgeIndex={edgeIndex}
          edgeStage={edgeStage}
          users={fields.slice(lastBelowIndex).map(f => f.on).flat()}
        /> }
      </div>
    );
  }
}

export default App;
