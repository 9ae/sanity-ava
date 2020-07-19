import React from 'react';
import classNames from 'classnames';

function Avatar (props) {
  const {user} = props;

  const popping = props.popping || false;
  const popped = props.popped || false;

  return (<div key={user.name}
    className={classNames({
      "avatar": true,
      "popping": popping,
      "popped": popped
    })}
    style={{"--user-color": user.color}}><img src={"images/"+ user.img} /></div>);
}

export default Avatar;