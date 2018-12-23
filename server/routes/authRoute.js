var express = require("express")
var router = express.Router()

// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

var User = require('../models/user.js')

router.get("/", (req, res) => {
    var string = ""
    User.find({}, (err, users) => {
        users.forEach(user => {
            string += user.email + '\n'
        });

        res.send(string)
    })
    
})

router.post('/createUser', (req, res) => {
    var email = req.body.email.toLowerCase()
    var password = req.body.password

    // check email and password are not empty
    if (!email || !password ) {
        res.send({
            status: false,
            error: {
                message: "Email or Password Fields are empty"
            }
        })
        return
    }

    // check if user already exist
    User.find({email: email}, (err, users) => {
        if (users.length != 0) {
            res.send({
                status: false,
                error: {
                    message: "User Already Exists!"
                }
            })
            return
        }

        // create new user
        bcrypt.hash(password, saltRounds, (error, hash) => {

            // mongodb error
            if (error) {
                res.send({
                    error: {
                        status: false,
                        message: "Some error with mongodb"
                    }
                })
                return
            }

            // create new user
            var newUser = User({
                email: email,
                passwordHash: hash
            })

            // save new user to db
            newUser.save(error => {
                // mongodb error
                if (error) {
                    res.send({
                        error: {
                            status: false,
                            message: "Some error with mongodb"
                        }
                    })
                    return
                } else {
                    req.session.loggedEmail = email
                    res.send({
                        status: true
                    })
                    return
                }
            })
        })
    })

})

router.post('/login', (req, res) => {

    if (req.session.loggedEmail) {
        res.send({
            status: true
        })
        return
    }

    // check email and password are not empty
    if (!req.body.email || !req.body.password ) {
        res.status(200).send({
            status: false,
            error: {
                message: "Email or Password Fields are empty"
            }
        })
        return
    }


    var email = req.body.email.toLowerCase()
    var password = req.body.password

    User.find({email: email}, (err, users) => {

        // user does not exist
        if (users.length == 0) {
            res.status(200).send({
                status: false,
                error: {
                    message: "User Does Not Exist!"
                }
            })
            return
        }

        // get the first user
        var user = users[0]

        // compare password
        bcrypt.compare(password, user.passwordHash, (err, passwordIsCorrect) => {
            if (err) throw err
            
            // password incorrect
            if ( !passwordIsCorrect ) {
                res.status(200).send({
                    status: false,
                    error: {
                        message: "Password Incorrect!"
                    }
                })
                return
            } else {

                // set cookies
                req.session.loggedEmail = user.email

                // send correct information
                res.send({
                    status: true
                })

            }


        })


    })
})

router.get('/signout', (req, res) => {
    req.session.loggedEmail = null
    res.send({
        status: true
    })
})

router.get('/reset', (req, res) => {
    User.find({}, (err, users) => {
        users.forEach(user => {
            user.remove()
        });

        res.send(true)
    })
})

module.exports = router