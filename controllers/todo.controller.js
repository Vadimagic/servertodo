import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma/prisma.js'

class TodoController {
	/*
		@desc 		create Todo
		@route 		POST /api/todo/create
		@access 	public
	*/
	createTodo = asyncHandler(async (req, res, next) => {
		try {
			const { name, email, text } = req.body

			const todo = await prisma.todo.create({
				data: {
					name,
					email,
					text
				}
			})

			res.json(todo)
		} catch (e) {
			next()
		}
	})

	/*
		@desc 		Update Todo by id
		@route 		POST /api/todo/:id
		@access 	private | root
	*/
	updateTodo = asyncHandler(async (req, res, next) => {
		const { name, email, text, completed } = req.body

		try {
			const oldTodo = await prisma.todo.findUnique({
				where: {
					id: +req.params.id
				}
			})
			const todo = await prisma.todo.update({
				where: {
					id: +req.params.id
				},
				data: {
					name,
					email,
					text,
					completed,
					changedText: oldTodo.text !== text
				}
			})

			res.json({ todo })
		} catch (e) {
			next()
		}
	})

	/*
		@desc 		Get Todo
		@route 		POST /api/todo/list
		@access 	public
	*/
	getTodoList = asyncHandler(async (req, res, next) => {
		try {
			const paginationCount = 3
			const { page, orderBy } = req.body

			const todoCount = await prisma.todo.count()
			const pagesCount = Math.ceil(todoCount / paginationCount) || 1
			const currentPage = pagesCount > page ? page : pagesCount
			const skip = (currentPage - 1) * paginationCount

			const todoList = await prisma.todo.findMany({
				orderBy,
				skip,
				take: paginationCount
			})

			res.json({
				todoList,
				currentPage,
				pagesCount
			})
		} catch (e) {
			next()
		}
	})
}

export default new TodoController()
