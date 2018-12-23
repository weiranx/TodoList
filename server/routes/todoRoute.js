var express = require("express")
var router = express.Router()

// set up mongoose models
var Todo = require("../models/todo.js")
var User = require("../models/user.js")

// check cookies middleware 
router.use("*", (req, res, next) => {
    if (!req.session.loggedEmail) {
        res.send({
            status: false,
            error: {
                message: "Not Logged In"
            }
        })
    } else {
        next()
    }
})


router.post('/createTodo', (req, res) => {
    var email = req.session['loggedEmail']
    var item = req.body.item
    
    var newTodo = Todo({
        item: item
    })

    User.find({email: email}, (err, users) => {
        if (err) throw err

        var user = users[0]

        user.todos.push(newTodo)

        user.save((err) => {
            if (err) throw err

            res.send({status: true})
        })
    })
})

router.get('/getTodos', (req, res) => {
    var email = req.session['loggedEmail']

    User.findOne({email: email}, (err, user) => {
        if (err) throw error

        res.send(user.todos)
    })
})

router.post('/toggleTodo', (req, res) => {
    var email = req.session['loggedEmail']
    var itemId = req.body.itemId

    User.findOne({email: email}, (err, user) => {
        var todo = user.todos.find(ele => ele._id == itemId)
        console.log(todo)
        todo.checked = !todo.checked
    
        user.save(err => {
            if (err) throw err
            
            res.send({
                status: true
            })
        })
    })
})

router.post('/removeTodo', (req, res) => {
    var email = req.session['loggedEmail']
    var itemId = req.body.itemId

    User.findOne({email: email}, (err, user) => {
        user.todos = user.todos.filter(ele => ele._id != itemId)

        user.save(err => {
            if (err) throw err
            
            res.send({
                status: true
            })
        })
    })
})





module.exports = router