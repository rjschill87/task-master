import React, { Component } from 'react';
import 'whatwg-fetch';
import moment from 'moment';

import Button from '../Button/Button';

class TaskForm extends Component {
  constructor(props) {
    super (props);

    this.state = {
      name: '',
      description: '',
      tags: '',
      points: '',
      due: '',
      assignedTo: '',
      completed: false,
      formError: false,
      errorMessage: '',
      priority: '',
      dependentTasks: {name: '', value: ''}
    };

    this.cancel = this.cancel.bind(this);
    this.formatTask = this.formatTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  cancel() {
    this.refs.taskform.reset();
    this.props.onCancel();
  }

  handleChange(event) {
    const target = event.target.name;
    const value = event.target.value;

    let state;

    if (target == 'dependentTasks') {
      const text = event.target.options[event.target.selectedIndex].text;
      state = {
        [target]: {name: text, value}
      }
    } else {
      state = {
        [target]: value
      }
    }

    if (target === 'name' || target === 'due') {
      state.formError = false;
    }

    this.setState(state);
  }

  formatTask(event) {
    if (this.state.name != '') {
      let tagString = this.state.tags;
      let tags = this._formatTags(tagString);
      let due = moment(this.state.due);

      if (due.isValid() || this.state.due == '') {
        const new_task = {
          name: this.state.name,
          description: this.state.description,
          due: due,
          tags: tags,
          points: this.state.points,
          due: this.state.due,
          assignedTo: this.state.assignedTo,
          priority: this.state.priority,
          dependentTasks: this.state.dependentTasks
        };
  
        this._submitTask(new_task);
      } else {
        this.setState({
          formError: true,
          errorMessage: 'Date is not valid'
        });
      }
    } else {
      this.setState({
        formError: true,
        errorMessage: 'Task must have a name'
      });
    }

    event.preventDefault();
  }

  _formatTags(tagString) {
    let tags;

    if (tagString.includes(',')) {
      tagString = tagString.replace(/\s/g, '');
      tags = tagString.split(',');
    } else {
      tags = [tagString];
    }

    return tags;
  }

  _submitTask(task) {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    }

    fetch(`/api/tasks/`, options)
      .then(res => res.json())
      .then(json => {
        this.props.onSubmit(json._id, 'add', json);
      });
  }

  renderTaskDropdown() {
    const { tasks } = this.props;
    let options;

    if (tasks && tasks.length > 0) {
      options = tasks.map((task, i) => (
        <option key={i} value={task._id}>{task.name}</option>
      ));
    }

    return options;
  }

  render() {
    return (
      <form onSubmit={this.formatTask} ref="taskform" className="tm-c-tasklist-form">
        <div className="tm-c-form-group">
          <input type="text" name="name" placeholder="Task Name" value={this.state.name} onChange={this.handleChange} />
          <input type="text" name="assignedTo" placeholder="Assignee" value={this.state.assignedTo} onChange={this.handleChange} />
        </div>
        <div className="tm-c-form-group">
          <textarea name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange} />
        </div>
        <div className="tm-c-form-group">  
          <input type="text" name="due" placeholder="Due Date (ex: 01/31/1970)" value={this.state.due} onChange={this.handleChange} />
          <select name="priority" value={this.state.value} onChange={this.handleChange} className="tm-c-select">
            <option value="">Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="tm-c-form-group">
          <select name="dependentTasks" value={this.state.dependentTasks.value} onChange={this.handleChange} className="tm-c-select">
            <option value="">Dependent task</option>
            {this.renderTaskDropdown()}
          </select>
        </div>
        <div className="tm-c-form-group">
          <input type="text" name="tags" placeholder="Tags, separated by comma" value={this.state.tags} onChange={this.handleChange} />
          <input type="number" name="points" placeholder="Points" value={this.state.points} onChange={this.handleChange} />
        </div>
        {
          this.state.formError &&
          <div className="tm-c-tasklist-form-error">{"Error: " + this.state.errorMessage}</div>
        }
        <div className="tm-c-button-container tm-c-button-container__centered">
          <Button
            modifiers={['primary']}
            text='Submit'
            type='submit'
          />
          <Button
            modifiers={['secondary']}
            text='Cancel'
            type='button'
            onClick={this.cancel}
          />
        </div>
      </form>
    );
  }
}

export default TaskForm;