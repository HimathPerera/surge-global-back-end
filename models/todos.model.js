const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const todo = new Schema({
    task: {type:String, required: true},
    status: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref:'User' },
})

module.exports = mongoose.model('Todo', todo)