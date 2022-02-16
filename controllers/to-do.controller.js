const HttpError = require('../models/http-error')
const { validationResult } = require("express-validator");
const mongoose = require("mongoose")
const Todo = require('../models/todos.model')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

////////////////////////get///////////////////////////////
const getToDoItems = async (req, res, next) => { 
    const uid = req.params.uid
    let todoItems;
    try {
        todoItems = await Todo.find({ creator: uid });
     } catch (err) { 
        const error = new HttpError('getting to-do items failed!', 500)
        return next(error);
    }

    if (!todoItems) { 
        const error = new HttpError('getting to-do items failed!', 404)
        return next(error);
    }

    res.json({ todos: todoItems.map(item => item.toObject({getters:true}))})
}
////////////////////////create///////////////////////////////
const createToDoItems = async (req, res, next) => { 
    const { task, status, creator } = req.body;

    const createdToDoItem = new Todo({
        task,
        status,
        creator
    })
  	var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    var decoded = token ? jwt.verify(token, 'STARKINDUSTRY') : null
  
  let user;
    try {
      user = await User.findById(creator)
    } catch (err) { 
      const error = new HttpError('error when creating todos')
      return next(error);
  }
  if (!user) { 
    const error = new HttpError('user not found in db when creating todos')
      return next(error);
  }
  // console.log(createdToDoItem)
  if (decoded && user.id === decoded.userId) {
    try {
      const sess = await mongoose.startSession()
      sess.startTransaction();
      await createdToDoItem.save({ session: sess });
      user.todos.push(createdToDoItem)
      //console.log(user)
      await user.save({ session: sess })
      await sess.commitTransaction();
    } catch (err) {
      console.log(err)
      const error = new HttpError('user not found in db when creating todoss')
      return next(error);
    }
    res.status(200).json(createdToDoItem);
  } else { 
    res.status(404).json({message:"Please login user expired"})
  }
  
}

////////////////////////update///////////////////////////////
const updateToDoItems = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
  
    const { status } = req.body;
    const itemId = req.params.tdid;
  
    var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
  var decoded = token ? jwt.verify(token, 'STARKINDUSTRY') : null
  
    let todoItem;
    try {
      todoItem = await (await Todo.findById(itemId));
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update Todo Status.',
        500
      );
      return next(error);
    }
  if (!todoItem) { 
    const error = new HttpError(
      'No to do founnd',
      400
    );
    return next(error);
  }
    todoItem.status = status;
  if (decoded && decoded.userId === todoItem.creator._id.toString()) {
    try {
      await todoItem.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update Todo Status.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ todoItem: todoItem.toObject({ getters: true }) });
  } else { 
    res.status(404).json({message:"Please login user expired"})
  }
    
};
////////////////////////delete///////////////////////////////
const deleteToDoItem = async (req, res, next) => {
    const itemId = req.params.tdid;
  
    let todoItem;
    try {
        todoItem = await Todo.findById(itemId).populate('creator');
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete todo item.',
        500
      );
      return next(error);
  }
  
  var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
  var decoded = token ? jwt.verify(token, 'STARKINDUSTRY') : null
  
  if (decoded && decoded.userId === todoItem.creator._id.toString()) {
    try {
      const sess = await mongoose.startSession()
      sess.startTransaction();
      await todoItem.remove({ session: sess });
      todoItem.creator.todos.pull(todoItem);
      await todoItem.creator.save({ session: sess })
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete todo item.',
        502
      );
      return next(error);
    }
  
    res.status(200).json({ message: 'Deleted todo item.' });
  } else { 
    res.status(404).json({message:"Please login user expired"})
  }
  };


exports.getToDoItems = getToDoItems;
exports.createToDoItems = createToDoItems;
exports.updateToDoItems = updateToDoItems;
exports.deleteToDoItem = deleteToDoItem;