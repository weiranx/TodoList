var mongoose = require("mongoose")
var Schema = mongoose.Schema


var TodoSchema = new Schema({
    item: {type: String, required: true},
    checked: {type: Boolean, required: true, default: false}
})


var Todo = mongoose.model("Todo", TodoSchema)

module.exports = Todo