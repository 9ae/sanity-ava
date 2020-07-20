import React from 'react';

import Avatar from './Avatar';

import './FoldPreview.css';

function FoldPreview (props) {

    const {placement, active, users, edgeIndex, edgeStage} = props

    const renderAvatar = (u) => (<Avatar key={u.name} user={u}
      stage={active && edgeIndex === u.index ? edgeStage : null}
    />);

    return (<div className={"fold " + placement}>
      {users.map(renderAvatar)}
    </div>)

}

export default FoldPreview;