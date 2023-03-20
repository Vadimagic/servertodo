import asyncHandler from 'express-async-handler'

import { ApiError } from '../exceptions/api-error.js'
import userService from '../service/user.service.js'

class UserController {
	/*
		@desc 		Register user
		@route 		POST /api/auth/register
		@access 	private | root
	*/
	register = asyncHandler(async (req, res, next) => {
		try {
			const { name, password, role } = req.body
			const checkLengthPassword = password.length >= 3 && password.length <= 32
			if (!checkLengthPassword) {
				return next(ApiError.BadRequest('Некорректные данные'))
			}
			const userData = await userService.registration(name, password, role)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'none',
				secure: true
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	})

	/*
		@desc 		Login user
		@route 		POST /api/auth/login
		@access 	public
	*/
	login = asyncHandler(async (req, res, next) => {
		try {
			const { name, password } = req.body
			const userData = await userService.login(name, password)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'none',
				secure: true
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	})

	/*
		@desc 		Logout user
		@route 		GET /api/auth/logout
		@access 	public
	*/
	logout = asyncHandler(async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies
			await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json({
				message: 'ok'
			})
		} catch (e) {
			next(e)
		}
	})

	/*
		@desc 		Refresh user
		@route 		GET /api/auth/refresh
		@access 	public
	*/
	refresh = asyncHandler(async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'none',
				secure: true
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	})
}

export default new UserController()
