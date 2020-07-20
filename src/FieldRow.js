import React from "react";
import classNames from "classnames";

import Avatar from "./Avatar";

class FieldRow extends React.Component {
  constructor(props) {
    super(props);
    this.avatarsRef = React.createRef();
  }

  componentDidMount() {
    const observer = this.props.observer;
    if (observer) {
      observer.observe(this.avatarsRef.current);
    }
  }

  render() {
    const { field, index, isOffScreen } = this.props;

    const renderAvatar = (u) => <Avatar key={u.name} user={u} />;

    return (
      <div className="row">
        <label>{field.name}</label>
        <div
          className={classNames({ presence: true, "off-screen": isOffScreen })}
          data-index={index}
          ref={this.avatarsRef}
        >
          {field.on.map(renderAvatar)}
        </div>
        {field.type === "textarea" ? (
          <textarea></textarea>
        ) : (
          <input type="text" />
        )}
      </div>
    );
  }
}

export default FieldRow;
