import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
	DragSource,
	DropTarget,
	ConnectDropTarget,
	ConnectDragSource,
	DropTargetMonitor,
	DropTargetConnector,
	DragSourceConnector,
	DragSourceMonitor,
} from 'react-dnd';
import Button from '../Button/Button';
import ChildTaskList from './ChildTaskList';
import moment from 'moment';
import 'whatwg-fetch';

const taskSource = {
  beginDrag(props) {
    return {
      id: props._id,
      index: props.index
    }
  }
}

const taskTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = (findDOMNode(
      component,
    )).getBoundingClientRect();

    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    const clientOffset = monitor.getClientOffset();

    const hoverClientY = (clientOffset).y - hoverBoundingRect.top;

		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
    }
    
    props.moveTask(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  }
}

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
    this.createTimeString = this.createTimeString.bind(this);
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
      .then(json => this.props.onUpdate(id, 'update', json));
  }

  deleteTask() {
    const id = this.props._id;

    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        this.props.onUpdate(id, 'delete');
      });
  }

  renderTags() {
    let tags = this.props.tags;
    return tags.length > 1 ? tags.join(', ') : tags.toString();
  }

  createTimeString() {
    let time;

    if (this.props.due) {
      time = moment(this.props.due).format("dddd, MMMM Do YYYY");
      return (<div className="tm-c-task-assignee">
                Due: {time}
              </div>
      );
    }
  }

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props;
    
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <li style={{opacity: (isDragging) ? 0 : 1}} className={(this.props.completed) ? "tm-c-task-wrapper tm-c-task-wrapper__completed" : "tm-c-task-wrapper"} id={this.props._id}>
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
                  <div className="tm-c-child-tasks-container">
                    <ChildTaskList parentId={this.props._id} childTasks={this.props.childTasks} onUpdate={this.props.onUpdate} />
                  </div>
                </div>
                <div className="tm-c-task-body tm-c-task-body__right">
                  <div className="tm-c-task-assignee">
                    {this.props.assignedTo != '' ? 'Assigned to ' + this.props.assignedTo : ''}
                  </div>
                  <div className="tm-c-task-assignee">
                    {this.createTimeString()}
                  </div>
                  <div className="tm-c-task-points">
                    {this.props.points && parseInt(this.props.points) ? this.props.points + ' pts.' : ''}
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
                  <div className="tm-c-button-container tm-c-button-container__right">
                    {
                      !this.props.completed &&
                      <Button
                        modifiers={['primary']}
                        onClick={this.completeTask}
                        text="Complete"
                        type="Button"
                      />
                    }
                    <Button
                      modifiers={['danger']}
                      onClick={this.deleteTask}
                      text="Delete"
                      type="Button"
                    />
                  </div>
                </footer>
              }
            </div>
          </li>
        )
      )
    );
  }
}

export const TaskDragSource = DragSource(
  'task',
  taskSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(Task)

export default DropTarget('task', taskTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(TaskDragSource)

