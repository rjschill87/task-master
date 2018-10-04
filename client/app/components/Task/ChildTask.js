import React, { Component } from 'react';
import Button from '../Button/Button';

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
    this.handleChange = this.handleChange.bind(this);
    this.expandList = this.expandList.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.renderChildTasks = this.renderChildTasks.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  addChildTask() {
    const id = this.props.parentId;

    const newTask = {
      name: this.state.name,
      description: this.state.description
    };

    let childTasks = this.props.childTasks;
    childTasks.push(newTask);

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
        this.setState({ formActive: false });
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
    let tasks = this.props.childTasks.map((task, i) => (
      <li className="tm-c-task-body tm-c-task-body__childlist" key={i}>
        <div className="tm-c-child-task-body">
          <div className="tm-c-task-header-title tm-c-task-header-title__child">{task.name}</div>
          <div className="tm-c-child-task-text">{task.description}</div>
        </div>
      </li>
    ));

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
          <div className="tm-c-button-container">
            {
              !this.state.formActive &&
              <Button
                modifiers={['primary']}
                onClick={this.toggleForm}
                text='New Child Task'
                type='button'
              />
            }
          </div>
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
            <form onSubmit={this.addChildTask} className="tm-c-tasklist-form tm-c-tasklist-form__compact">
              <input type="text" name="name" placeholder="Task Name" value={this.state.name} onChange={this.handleChange} />
              <input type="text" name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange} />
              <div class="tm-c-button-container">
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
      </div>
    )
  }
}

export default ChildTask;