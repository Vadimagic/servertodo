import express from 'express'

import todoController from '../controllers/todo.controller.js'
import { checkAuth } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/check-role.middleware.js'

// import { protectAuthRoot } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.route('/create').post(todoController.createTodo)
router.route('/list').post(todoController.getTodoList)
router
	.route('/:id')
	.patch(checkAuth, checkRole(['admin']), todoController.updateTodo)

export default router
