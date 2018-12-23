import React, { Component } from 'react'
import axios from "axios"
import "./Nav.css"

class Nav extends Component {

    constructor() {
        super()
        axios.defaults.withCredentials = true;
        this.state = {
            loggedIn: false
        }
        
    }

    componentDidMount() {
        axios.post("http://localhost:8080/auth/login").then(res => {
            if (res.data.status) {
                this.setState({
                    loggedIn: true
                })
                this.props.userUpdate(true)
            }
        })
    }

    handleLogin = (evt) => {
        if (evt) evt.preventDefault()
        const email = this.refs.inputEmail.value
        const password = this.refs.inputPassword.value

        var postData = {
            email: email,
            password: password
        }
        
        axios.post("http://localhost:8080/auth/login", postData).then(res => {
            console.log(res.data)
            if (!res.data.status) {
                alert(res.data.error.message)
            } else {
                this.setState({
                    loggedIn: true
                })
                this.props.userUpdate(true)
            }
        }).catch(err =>
            alert(err)
        )
        
    }
    handleSignup = (evt) => {
        if (evt) evt.preventDefault()
        const email = this.refs.inputEmail.value
        const password = this.refs.inputPassword.value

        var postData = {
            email: email,
            password: password
        }
        
        axios.post("http://localhost:8080/auth/createUser", postData).then(res => {
            console.log(res.data)
            if (!res.data.status) {
                alert(res.data.error.message)
            } else {
                this.setState({
                    loggedIn: true
                })
                this.props.userUpdate(true)
            }
        })
    }
    handleSignout = () => {
        axios.get("http://localhost:8080/auth/signout").then(res => {
            console.log(res)
        })
        this.setState({
            loggedIn: false
        })
        this.props.userUpdate(false)
    }

    
    render() {

        const displayTitleStyle = {
            "text-align": "center",
            "margin-top": "2em"
        }
        const signinTextStyle = {
            "text-align": "center"
        }

        return (
            <div className="Nav container">
                <h1 className="display-4" style={displayTitleStyle}>To Do List</h1>
                { !this.state.loggedIn ?
                    <form>
                            <div className="form-group">
                                <label for="inputEmail">Email address</label>
                                <input type="email" className="form-control" ref="inputEmail" placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label for="inputPassword">Password</label>
                                <input type="password" className="form-control" ref="inputPassword" placeholder="Enter password" />
                            </div>
                            <button className="btn btn-primary" onClick={this.handleLogin}>Log In</button>
                            <button className="btn btn-primary sign-up-button" onClick={this.handleSignup}>Sign Up</button>
                    </form> :
                    <button className="btn btn-primary" onClick={this.handleSignout}>Signout</button>
                }
            </div>
        )
    }
}

export default Nav