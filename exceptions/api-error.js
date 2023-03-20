export class ApiError extends Error {
	status

	constructor(status, message) {
		super(message)
		this.status = status
	}

	static UnauthorizedError(text = 'Пользователь не авторизован') {
		return new ApiError(401, text)
	}

	static BadRequest(message) {
		return new ApiError(400, message)
	}

	static NotFound(message) {
		return new ApiError(404, message)
	}
}
