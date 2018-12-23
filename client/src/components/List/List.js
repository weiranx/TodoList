import React, { Component } from 'react'
import axios from "axios"
import "./List.css"


class List extends Component {

    constructor() {
        super()
        this.state = {
            todos: [
                // {
                //     item: "Take out trash",
                //     checked: false,
                //     _id: 1
                // },
                // {
                //     item: "Clean bathroom",
                //     checked: false,
                //     _id: 2
                // },
                // {
                //     item: "Clean table",
                //     checked: false,
                //     _id: 3
                // }
            ]
        }
    }

    loadData = () => {
        axios.get("http://localhost:8080/todo/getTodos").then(res => {
            this.setState({
                todos: res.data
            })
        })
    }

    componentDidMount() {
        this.loadData()
    }

    handleListItemClicked = item => {
        // const index = item.target.getAttribute("index")
        // var todos = this.state.todos
        // todos[index].checked = !todos[index].checked

        // linear search
        var id = ""
        
        for (var todo of this.state.todos) {
            console.log(todo._id + item.target.getAttribute("index"))
            if (todo._id === item.target.getAttribute("index")) {
                id = todo._id
                todo.checked = !todo.checked
                break
            }
        }

        this.setState({
            todos: this.state.todos
        })

        // update server
        // var id = todos[index]._id
        axios.post("http://localhost:8080/todo/toggleTodo", {
            itemId: id
        }).then( res => {
            console.log(res)
        })

    }

    handleAddTodo = () => {
        var newTodo = this.refs.newTodoContent.textContent
        if (newTodo) {
            axios.post("http://localhost:8080/todo/createTodo", {
                item: newTodo
            }).then( res => {
                this.loadData()
                this.refs.newTodoContent.textContent = ""
            })
        }
    }

    handleDeleteTodo = (evt) => {
        axios.post("http://localhost:8080/todo/removeTodo", {
            itemId: evt.target.getAttribute("index")
        }).then( res => {
            this.loadData()
            this.refs.newTodoContent.textContent = ""
        })
    }


    render() {
        const { todos } = this.state
        
        return (

                <div className="List container">
                    <ul className="list-group">
                        { todos &&
                            // unchecked
                            todos.filter(todo => todo.checked===false).map((todo, i) => {
                                var className = "list-group-item"
                                return <li className={className} key={todo._id} index={todo._id} onClick={this.handleListItemClicked}>{todo.item}</li>
                            })
                        }
                        { todos &&
                            // checked
                            todos.filter(todo => todo.checked===true).map((todo, i) => {
                                var className = "list-group-item item-checked"
                                return <li className={className} key={todo._id} >
                                            <div index={todo._id} onClick={this.handleListItemClicked}>{todo.item}</div>
                                            <button index={todo._id} className="btn btn-sm btn-danger" onClick={this.handleDeleteTodo}>Delete</button>
                                    </li>
                            })
                        }
                        <li  className="list-group-item" >
                            <div contenteditable="true" id="newTodoContent" ref="newTodoContent"></div>
                            <button className="btn btn-sm btn-success" onClick={this.handleAddTodo}>Add</button>
                        </li>
                    </ul>
                </div>
        )
    }
}

export default List