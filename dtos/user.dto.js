export class UserDto {
	id
	name
	role

	constructor(data) {
		this.id = data.id
		this.name = data.name
		this.role = data.role
	}
}
