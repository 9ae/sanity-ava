import React from 'react';
import classNames from 'classnames';

import './Avatar.css';

function Avatar (props) {
  const {user} = props;

  const stage = props.stage ? (' '+ props.stage) : ''

  return (<div key={user.name}
    className={"avatar" + stage}
    style={{"--user-color": user.color}}><img src={"images/"+ user.img} /></div>);
}

export default Avatar;