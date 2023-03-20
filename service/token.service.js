import jwt from 'jsonwebtoken'

import { ApiError } from '../exceptions/api-error.js'
import { prisma } from '../prisma/prisma.js'

class TokenService {
	generateTokens = payload => {
		const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
			expiresIn: '20m'
		})
		const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
			expiresIn: '30d'
		})
		return {
			accessToken,
			refreshToken
		}
	}

	validateAccessToken = token => {
		try {
			const userData = jwt.verify(token, process.env.JWT_SECRET_ACCESS)
			return userData
		} catch (e) {
			return null
		}
	}

	validateRefreshToken = token => {
		try {
			const userData = jwt.verify(token, process.env.JWT_SECRET_REFRESH)
			return userData
		} catch (e) {
			return null
		}
	}

	saveToken = async (userId, refreshToken) => {
		const tokenData = await prisma.token.findUnique({
			where: {
				userId
			}
		})

		if (tokenData) {
			const data = await prisma.token.update({
				where: {
					userId
				},
				data: {
					refreshToken
				}
			})
			return data
		}

		const newToken = await prisma.token.create({
			data: {
				userId,
				refreshToken
			}
		})
		return newToken
	}

	removeToken = async refreshToken => {
		try {
			const decodedUser = jwt.verify(
				refreshToken,
				process.env.JWT_SECRET_REFRESH
			)
			const tokenData = await prisma.token.delete({
				where: {
					userId: decodedUser.id
				}
			})
			return tokenData
		} catch (e) {
			throw ApiError.BadRequest('Токена нет в базе')
		}
	}

	findToken = async refreshToken => {
		const tokenData = await prisma.token.findFirst({
			where: {
				refreshToken
			}
		})
		return tokenData
	}
}

export default new TokenService()
