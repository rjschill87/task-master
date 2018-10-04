import React, { Component } from 'react';
import Button from '../Button/Button';
import 'whatwg-fetch';

class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false

    };

    this.expandTask = this.expandTask.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.renderTags = this.renderTags.bind(this);
  }

  expandTask() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  completeTask() {
    const id = this.props._id;

    const options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({completed: true})
    };

    fetch(`/api/tasks/${id}/update`, options)
      .then(res => res.json())
      .then(json => this.props.onComplete(id, 'update', json));
  }

  deleteTask() {
    const id = this.props._id;

    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        this.props.onDelete(id, 'delete');
      });
  }

  renderTags() {
    let tags = this.props.tags;
    return tags.length > 1 ? tags.join(', ') : tags.toString();
  }

  render() {
    let buttons = (
      <div className="tm-c-button-container tm-c-button-container__right">
        <Button
          modifiers={['primary']}
          onClick={this.completeTask}
          text="Complete"
          type="Button"
        />
        <Button
          modifiers={['danger']}
          onClick={this.deleteTask}
          text="Delete"
          type="Button"
        />
      </div>
    );

    if (this.props.completed) {
      buttons = (
        <div className="tm-c-button-container tm-c-button-container__right">
          <Button
            modifiers={['danger']}
            onClick={this.deleteTask}
            text="Delete"
            type="Button"
          />
        </div>
      );
    }
    
    return (
      <li className="tm-c-task-wrapper" id={this.props._id}>
        <div className="tm-c-task-container">
          <header className="tm-c-task-header">
            <span className="tm-c-task-expander" onClick={this.expandTask}> {!this.state.expanded ? '+' : '-'} </span>
            <h3 className="tm-c-task-header-title">
              {(this.props.completed) ? this.props.name + ' (Completed)' : this.props.name}
            </h3>
          </header>
          <div className={(this.state.expanded) ? 'tm-c-task-body-container tm-c-task-body-container__expanded' : 'tm-c-task-body-container'}>
            <div className="tm-c-task-body tm-c-task-body__left">
              <div className="tm-c-task-description">
                {this.props.description}
              </div>
            </div>
            <div className="tm-c-task-body tm-c-task-body__right">
              <div className="tm-c-task-assignee">
                {this.props.assignedTo != '' ? 'Assigned to ' + this.props.assignedTo : ''}
              </div>
              <div className="tm-c-task-points">
                {this.props.points} pts
              </div>
            </div>
          </div>
          {
            this.state.expanded &&
            <footer className="tm-c-task-footer">
              <div className="tm-c-task-tags-container">
                <span className="tm-c-task-tags">
                  Tags: {this.renderTags()}
                </span>
              </div>
              {buttons}
            </footer>
          }
        </div>
      </li>
    );
  }
}

export default Task;