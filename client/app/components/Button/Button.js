import React, { Component } from 'react';

class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.renderModifiers = this.renderModifiers.bind(this);
  }

  renderModifiers() {
    const modifiers = this.props.modifiers;
    let classes = 'tm-c-button';

    if (modifiers.length > 0) {
      modifiers.forEach(modifier => {
        classes += ' tm-c-button__' + modifier;
      });
    }

    return classes;
  }

  render() {
    return (
      <button 
        className={this.renderModifiers()}
        onClick={this.props.onClick}
        type={this.props.type}
      >
      {this.props.text}
      </button>
    )
  }
}

export default Button