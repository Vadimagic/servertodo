import jwt from 'jsonwebtoken'

export const checkRole = roles => {
	return function (req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1]
			if (!token) {
				return res.status(401).json({ message: 'Не авторизован' })
			}
			const decoded = req.user
				? req.user
				: jwt.verify(token, process.env.JWT_SECRET_ACCESS)
			if (!roles.includes(decoded.role)) {
				return res.status(403).json({ message: 'Нет доступа' })
			}
			req.user = decoded
			next()
		} catch (e) {
			res.status(401).json({ message: 'Не авторизован', stack: e.stack })
		}
	}
}
