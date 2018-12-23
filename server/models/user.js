var mongoose = require("mongoose")
var Schema = mongoose.Schema

var TodoSchema = new Schema({
    item: {type: String, required: true},
    checked: {type: Boolean, required: true, default: false}
})

var UserSchema = new Schema({
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    todos: [TodoSchema]
})


var User = mongoose.model("User", UserSchema)

module.exports = User