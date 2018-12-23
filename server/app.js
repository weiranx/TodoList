var express = require("express")
var app = express()



// !!!!!! Developmental Use
// local testing
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.10:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'application/json,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    

    // Pass to next layer of middleware
    next();
});





// set body parser
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// set express session
var session = require('express-session')
app.use(session({
    secret: "to do list app session",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 600000}
}))

// set mongoose
var mongoose = require("mongoose")
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
})

// mongodb user
var User = require('./models/user.js')


// set auth route
var authRoute = require('./routes/authRoute.js')
app.use('/auth', authRoute)

// set todo route
var todoRoute = require('./routes/todoRoute.js')
app.use('/todo', todoRoute)

// default route
app.get('/', (req, res) => {

    res.send("Hello World")
})




// listen
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Listen on port " + PORT)
})