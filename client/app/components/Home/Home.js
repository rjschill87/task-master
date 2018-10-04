import React, { Component } from 'react';
import 'whatwg-fetch';

import Task from '../Task/Task';
import TaskForm from '../Forms/TaskForm';
import Button from '../Button/Button';
import Search from '../Search/Search';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      formActive: false,
    };

    this.toggleNewTask = this.toggleNewTask.bind(this);

    this._refreshTasks = this._refreshTasks.bind(this);
    this._updateTaskList = this._updateTaskList.bind(this);
  }

  componentDidMount() {
    this._refreshTasks();
  }

  toggleNewTask() {
    this.setState({
      formActive: !this.state.formActive
    });
  }

  _refreshTasks() {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(json => {
        this.setState({
          tasks: json
        });
      });
  }

  _updateTaskList(id, action, updatedTask = {}, newTaskList = []) {
    let updatedTasks = [];

    switch (action) {
      case 'add' :
        updatedTasks = this.state.tasks;
        updatedTasks.push(updatedTask);
        break;
      case 'update' :
        updatedTasks = this.state.tasks.map((task) => {
          return (task._id === id) ? updatedTask : task;
        });
        break;
      case 'delete' :
        updatedTasks = this.state.tasks.filter(task => task._id != id);
        break;
      case 'search' :
        updatedTasks = newTaskList;
        break;
      default :
        updatedTasks = this._refreshTasks();
        break;
    }
    
    this.setState({
      tasks: updatedTasks
    });
  }

  render() {
    let tasklist = (
      <div className="tm-c-tasklist-container">
        <span className="tm-c-tasklist-container-text">
          No tasks found.
        </span>
      </div>
    );

    if (this.state.tasks.length > 0) {
      tasklist = (
        <div className="tm-c-tasklist-container">
          <ul className="tm-c-tasklist">
            { this.state.tasks.length > 0 &&
              this.state.tasks.map((task) => (
                <Task {...task} key={task._id} onComplete={this._updateTaskList} onDelete={this._updateTaskList} />
            )) }
          </ul>
        </div>
      );
    }

    return (
      <div className="tm-c-tasklist-wrapper">
        <header className="tm-c-tasklist-container">
          <div className="tm-c-tasklist-header tm-c-tasklist-header__left">
            <h1 className="tm-c-tasklist-header-title">Tasks</h1>
          </div>
          <div className="tm-c-tasklist-header tm-c-tasklist-header__right">
            <Search
              search={this._updateTaskList}
              clear={this._refreshTasks}
            />
          </div>
        </header>
        {tasklist}
        {
          this.state.formActive &&
          <TaskForm onSubmit={this._updateTaskList} active={this.state.formActive} onCancel={this.toggleNewTask}/>
        }
        <footer className="tm-c-tasklist-footer">
          {
            this.state.formActive !== true &&
              <div className="tm-c-button-container">
                <Button
                  modifiers={['primary']}
                  onClick={this.toggleNewTask}
                  text='New Task'
                  type='button'
                />
              </div>
          }
        </footer>
      </div>
    );
  }
}

export default Home;
