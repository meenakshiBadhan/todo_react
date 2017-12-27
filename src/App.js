import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo';
import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from './lib/todoHelpers';
import PropTypes from 'prop-types'
import {loadTodos, createTodo, saveTodo, destroyTodo} from './lib/todoService'

class App extends Component {
  state = {
    todos: [],
    currentTodo: ''
  }

  static contextTypes = {
    route: PropTypes.string
  }

  componentDidMount(){
    loadTodos()
    .then(todos => this.setState({todos}))
  }

  showTempMessage = (msg) => {
    this.setState({message: msg})
    setTimeout(() =>this.setState({message: ''}), 2500)
  }

  handleToggle = (id) => {
    const todo = findById(id, this.state.todos)
    const toggled = toggleTodo(todo)
    const updatedTodos = updateTodo(this.state.todos, toggled)
    this.setState({
      todos: updatedTodos
    })
    saveTodo(toggled)
    .then(() => this.showTempMessage('Todo Updated'))
  }

  handleInputChange = (evt) => {
    this.setState({
      currentTodo: evt.target.value
    })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    const newId = generateId()
    const newTodo = {id: newId, name: this.state.currentTodo, isComplete: false}
    const updatedTodos = addTodo(this.state.todos, newTodo)
    this.setState({
      todos: updatedTodos,
      currentTodo: '',
      errorMessage: ''
    })
    createTodo(newTodo)
    .then(() => this.showTempMessage('Todo Added'))
  }

  handleEmptySubmit = (evt) => {
    evt.preventDefault()
    this.setState({
      errorMessage: 'Please supply a todo name'
    })
  }

  handleRemove = (id, evt) => {
    evt.preventDefault()
    const updatedTodos = removeTodo(this.state.todos, id)
    this.setState({todos: updatedTodos})
    destroyTodo(id)
    .then(() => this.showTempMessage('Todo Removed'))
  }

  render() {
    const submitHandler = this.state.currentTodo ? this.handleSubmit : this.handleEmptySubmit
    const displayTodos = filterTodos(this.state.todos, this.context.route)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          {this.state.errorMessage && <span>{this.state.errorMessage}</span>}
          {this.state.message && <span>{this.state.message}</span>}
          <TodoForm handleInputChange={this.handleInputChange} 
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler}/>
          <TodoList handleToggle={this.handleToggle} 
            todos={displayTodos}
            handleRemove={this.handleRemove}
          />
          <Footer/>
        </div>
      </div>
    );
  }
}

export default App;
