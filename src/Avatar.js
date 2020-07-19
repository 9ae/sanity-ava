import React from 'react';

function Avatar (props) {
  const {user} = props;

  return (<div key={user.name} className="avatar" style={{"--user-color": user.color}}><img src={"images/"+ user.img} /></div>);
}

export default Avatar;