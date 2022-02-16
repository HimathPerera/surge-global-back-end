const express = require('express');
const { check } = require('express-validator')
const todoController = require('../controllers/to-do.controller')
const checkAuth = require('../middleware/check-auth')

const router = express.Router();

router.get('/getMyTodos/:uid', todoController.getToDoItems)
router.use(checkAuth); 
router.post('/createTodo', todoController.createToDoItems)
router.patch('/updateToDoItems/:tdid', [
    check('status').not().isEmpty()
],todoController.updateToDoItems)
router.delete('/deleteTodo/:tdid',todoController.deleteToDoItem)
module.exports = router; 