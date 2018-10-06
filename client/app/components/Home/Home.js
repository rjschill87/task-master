import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import ls from 'local-storage';
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
    this.renderTasklist = this.renderTasklist.bind(this);
    this._refreshTasks = this._refreshTasks.bind(this);
    this._updateTaskList = this._updateTaskList.bind(this);
    this.moveTask = this.moveTask.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
  }

  componentDidMount() {
    let tasks = ls.get('tasks');
    if (tasks) {
      this.setState({
        tasks
      });
    } else {
      this._refreshTasks();
    }
  }

  toggleNewTask() {
    this.setState({
      formActive: !this.state.formActive
    });
  }

  _refreshTasks() {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(tasks => this.setState({tasks}));
  }

  _updateTaskList(id, action, updatedTask = {}, newTaskList = []) {
    let tasks = [];

    switch (action) {
      case 'add' :
        tasks = this.state.tasks;
        tasks.push(updatedTask);
        break;
      case 'update' :
        tasks = this.state.tasks.map((task) => {
          return (task._id === id) ? updatedTask : task;
        });
        break;
      case 'delete' :
        tasks = this.state.tasks.filter(task => task._id != id);
        break;
      case 'search' :
        tasks = newTaskList;
        break;
      default :
        tasks = this._refreshTasks();
        break;
    }
    
    this.setState({
      tasks,
      formActive: false
    });

    ls.set('tasks', tasks);
  }

  moveTask(dragIndex, hoverIndex) {
    const { tasks } = this.state;
    const dragTask = tasks[dragIndex];

    this.setState(
      update(this.state, {
        tasks: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragTask]]
        }
      })
    );

    ls.set('tasks', this.state.tasks);
  }

  renderTasklist() {
    const { tasks } = this.state;

    let tasklist = (
      <div className="tm-c-tasklist-container">
        <span className="tm-c-tasklist-container-text">
          No tasks found.
        </span>
      </div>
    );

    if (tasks && tasks.length > 0) {
      tasklist = (
        <div className="tm-c-tasklist-container">
          <ul className="tm-c-tasklist">
            {
              tasks.map((task, i) => (
                <Task {...task} index={i} moveTask={this.moveTask} key={task._id} ref={task._id} onUpdate={this._updateTaskList} scrollTo={this.scrollTo}/>
              ))
            }
          </ul>
        </div>
      );
    }

    return tasklist;
  }

  scrollTo(taskId) {
    const node = findDOMNode(this.refs[taskId]);
    node.scrollIntoView({behavior: 'smooth'});
  }

  render() {
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
        {this.renderTasklist()}
        {
          this.state.formActive &&
          <TaskForm tasks={this.state.tasks} onSubmit={this._updateTaskList} active={this.state.formActive} onCancel={this.toggleNewTask}/>
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

export default DragDropContext(HTML5Backend)(Home);
