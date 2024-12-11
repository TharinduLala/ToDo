const express = require('express');
const router = express.Router();
const toDoController = require('../controllers/todoController');
const authMiddleware = require('../config/authMiddleware'); 


router.post('/', authMiddleware, toDoController.addTodo);
router.get('/', authMiddleware, toDoController.getTodos); 
router.put('/:id', authMiddleware, toDoController.updateTodo);  
router.delete('/:id', authMiddleware, toDoController.deleteTodo);

module.exports = router;
