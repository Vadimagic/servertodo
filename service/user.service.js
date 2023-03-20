import { hash, verify } from 'argon2'

import { UserDto } from '../dtos/user.dto.js'
import { ApiError } from '../exceptions/api-error.js'
import { prisma } from '../prisma/prisma.js'

import tokenService from './token.service.js'

class UserService {
	registration = async (name, password, role = 'user') => {
		const userExist = await prisma.user.findUnique({
			where: {
				name
			}
		})
		if (userExist) {
			throw ApiError.BadRequest(`Пользователь ${name} уже существует`)
		}
		const hashPassword = await hash(password)

		const user = await prisma.user.create({
			data: {
				name,
				password: hashPassword,
				role
			}
		})

		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}

	login = async (name, password) => {
		const user = await prisma.user.findUnique({
			where: {
				name
			}
		})
		const isValidPassword = await verify(user.password, password)
		if (user && isValidPassword) {
			const userDto = new UserDto(user)
			const tokens = tokenService.generateTokens({ ...userDto })
			await tokenService.saveToken(userDto.id, tokens.refreshToken)
			return { user: userDto, ...tokens }
		} else {
			throw ApiError.BadRequest('Неверный логин или пароль')
		}
	}

	logout = async refreshToken => {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	refresh = async refreshToken => {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}
		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenData = await tokenService.findToken(refreshToken)
		if (!userData || !tokenData) {
			throw ApiError.UnauthorizedError('Токен недействителен или отсутствует')
		}
		const user = await prisma.user.findUnique({
			where: {
				id: userData.id
			}
		})
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}
}

export default new UserService()
