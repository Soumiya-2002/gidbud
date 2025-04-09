const express = require('express');
const { createTask, listTasks, getTask, acceptTask, completeTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/task/create', authMiddleware, upload.single('attachment'), createTask);
router.get('/task/list', authMiddleware, listTasks);
router.get('/task/:id', authMiddleware, getTask);
router.post('/task/accept/:id', authMiddleware, acceptTask);
router.post('/task/complete/:id', authMiddleware, completeTask);
router.delete('/task/delete/:id', authMiddleware, deleteTask);

module.exports = router;
