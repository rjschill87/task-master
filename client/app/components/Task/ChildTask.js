import React, { Component } from 'react';
import Button from '../Button/Button';
import _ from 'lodash';

class ChildTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      formActive: false,
      listExpanded: false
    };

    this.addChildTask = this.addChildTask.bind(this);
    this.completeChildTask = this.completeChildTask.bind(this);
    this.deleteChildTask = this.deleteChildTask.bind(this);
    this._updateParentTask = this._updateParentTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.expandList = this.expandList.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.renderChildTasks = this.renderChildTasks.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  addChildTask() {
    const newTask = {
      _id: _.uniqueId(),
      name: this.state.name,
      description: this.state.description,
      completed: false
    };

    let childTasks = this.props.childTasks;
    childTasks.push(newTask);

    this.refs.childTaskForm.reset();
    this._updateParentTask(childTasks);
  }

  completeChildTask(updatedTask) {
    updatedTask.completed = true;
    const childTasks = this.props.childTasks.map((task) => {
      return (updatedTask._id === task._id) ? updatedTask : task;
    });

    this._updateParentTask(childTasks);
  }

  deleteChildTask(updatedTask) {
    const childTasks = this.props.childTasks.filter(task => task._id !== updatedTask._id);
    this._updateParentTask(childTasks);
  }

  _updateParentTask(childTasks) {
    const id = this.props.parentId;

    const options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({childTasks})
    };

    fetch(`/api/tasks/${id}/update`, options)
      .then(res => res.json())
      .then(json => {
        this.setState({ formActive: false, listExpanded: true });
        this.props.onUpdate(id, 'update', json);
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  expandList() {
    this.setState({
      listExpanded: !this.state.listExpanded
    })
  }

  toggleForm() {
    this.setState({
      formActive: !this.state.formActive
    });
  }

  renderChildTasks() {
    let tasks = this.props.childTasks.map((task, i) => {
      const cardClass = (task.completed) ? 'tm-c-task-body tm-c-task-body__childlist tm-c-task-body__childlist-completed' : 'tm-c-task-body tm-c-task-body__childlist';
      const titleClass = (task.completed) ? 'tm-c-task-header-title tm-c-task-header-title__child tm-c-task-header-title__child-completed' : 'tm-c-task-header-title tm-c-task-header-title__child';
      return (
        <li className={cardClass} key={i}>
          <div className="tm-c-child-task-body">
            <div className={titleClass}>{task.name}</div>
            <div className="tm-c-child-task-text">{task.description}</div>
          </div>
          <div className="tm-c-button-container">
            {
              !task.completed &&
              <Button
                  modifiers={['primary']}
                  onClick={() => {this.completeChildTask(task)}}
                  text='✓'
                  type='button'
              />
            }
            <Button
              modifiers={['danger']}
              onClick={() => {this.deleteChildTask(task)}}
              text='X'
              type='button'
            />
          </div>
        </li>
      )
    });

    return tasks;
  }

  renderHeader() {
    if (this.props.childTasks.length > 0) {
      return (
        <header className="tm-c-child-tasklist-header">
          <span className="tm-c-task-expander" onClick={this.expandList}> {!this.state.listExpanded ? '+' : '-'} </span>
          <h3 className="tm-c-tasklist-header-title">
            Child tasks
          </h3>
        </header>
      )
    } else {
      return (
        <header className="tm-c-child-tasklist-header">
          <h3 className="tm-c-tasklist-header-title">
            No child tasks found.
          </h3>
        </header>
      )
    }
  }

  render() {
    return (
      <div className="tm-c-child-tasklist-container">
        {this.renderHeader()}
        {
          this.state.listExpanded &&
          <ul className="tm-c-child-tasklist">
            {
              this.props.childTasks.length > 0 &&
              this.renderChildTasks()
            }
          </ul>
        }
        {
          this.state.formActive &&
          <div className="tm-c-child-tasklist-form-container">
            <form onSubmit={this.addChildTask} ref="childTaskForm" className="tm-c-tasklist-form tm-c-tasklist-form__compact">
              <input type="text" name="name" placeholder="Task Name" value={this.state.name} onChange={this.handleChange} />
              <input type="text" name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange} />
              <div className="tm-c-button-container">
                <Button 
                  modifiers={['primary']}
                  onClick={this.addChildTask}
                  text='Submit'
                  type='button'
                />
                <Button 
                modifiers={['secondary']}
                onClick={this.toggleForm}
                text='Cancel'
                type='button'
              />
              </div>
            </form>
          </div>
        }
        <div className="tm-c-button-container">
          <Button
            modifiers={['primary']}
            onClick={this.toggleForm}
            text='New Child Task'
            type='button'
          />
        </div>
      </div>
    )
  }
}

export default ChildTask;