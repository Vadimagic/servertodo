import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'

// import morgan from 'morgan'
import { errorHandler, notFound } from './middlewares/error.middleware.js'
import { prisma } from './prisma/prisma.js'
import todoRoutes from './router/todo.routes.js'
import userRoutes from './router/user.routes.js'

dotenv.config()

const app = express()

async function main() {
	// if (process.env.NODE_ENV === 'development') {
	// 	app.use(morgan('dev'))
	// }
	app.use(
		cors({
			credentials: true,
			origin: process.env.CLIENT_URL
		})
	)
	app.use(express.json())
	app.use(cookieParser())

	app.use('/api/auth', userRoutes)
	app.use('/api/todo', todoRoutes)

	app.use(notFound)
	app.use(errorHandler)
	const PORT = process.env.PORT || 5000
	app.listen(
		PORT,
		console.log(
			`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
		)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect
		process.exit()
	})
