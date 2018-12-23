import React, { Component } from 'react'

import Nav from './components/Nav/Nav.js'
import List from './components/List/List.js'

class App extends Component {

    constructor() {
        super()
        this.state = {
            loggedin: false
        }
    }

    handleUserUpdate = userLoggedin => {
        this.setState({
            loggedin: userLoggedin
        })
    }
    
    render() {
        return (
            <div className="App">
                <Nav userUpdate={this.handleUserUpdate}/>
                {this.state.loggedin && <List loggedin={this.state.loggedin}/>}
            </div>
        )
    }
}

export default App