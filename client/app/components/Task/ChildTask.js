import React, { Component } from 'react';
import Button from '../Button/Button';

class ChildTask extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const cardClass = (this.props.completed) ? 'tm-c-task-body tm-c-task-body__childlist tm-c-task-body__childlist-completed' : 'tm-c-task-body tm-c-task-body__childlist';
    const titleClass = (this.props.completed) ? 'tm-c-task-header-title tm-c-task-header-title__child tm-c-task-header-title__child-completed' : 'tm-c-task-header-title tm-c-task-header-title__child';
    
    return (
      <li className={cardClass}>
        <div className="tm-c-child-task-body">
          <div className={titleClass}>{this.props.name}</div>
          <div className="tm-c-child-task-text">{this.props.description}</div>
        </div>
        <div className="tm-c-button-container">
          {
            !this.props.completed &&
            <Button
                modifiers={['primary']}
                // onClick={() => {this.completeChildTask(task)}}
                onClick={this.props.onComplete}
                text='✓'
                type='button'
            />
          }
          <Button
            modifiers={['danger']}
            // onClick={() => {this.deleteChildTask(task)}}
            onClick={this.props.onDelete}
            text='X'
            type='button'
          />
        </div>
      </li>
    )
  }
}

export default ChildTask;