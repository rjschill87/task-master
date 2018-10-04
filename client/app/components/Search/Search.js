import React, { Component } from 'react';
import 'whatwg-fetch';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };

    this.timer = null;

    this.handleChange = this.handleChange.bind(this);
    this._search = this._search.bind(this);
  }

  handleChange(event) {
    clearTimeout(this.timer);

    this.setState({
      [event.target.name]: event.target.value
    }, () => {
      if (this.state.query == '') {
        this.props.clear();
      } else {
        this.timer = setTimeout(this._search(), 1000);
      }
    });
  }

  _search() {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query: this.state.query})
    }

    fetch('/api/tasks/search', options)
      .then(res => res.json())
      .then(tasks => {
        this.props.search(0, 'search', {}, tasks);
      });
  }

  render() {
    return (
      <div className="tm-c-search-container">
        <input type="text" name="query" placeholder="Search..." onChange={this.handleChange} value={this.state.query}/>
      </div>
    )
  }
}

export default Search;