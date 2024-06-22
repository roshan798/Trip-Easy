class UserDTO {
    constructor(user) {
        this.id = user._id
        this.username = user.username
        this.email = user.email
        this.address = user.address
        this.phone = user.phone
        this.avatar = user.avatar
        this.user_role = user.user_role
        this.createdAt = user.createdAt
        this.updatedAt = user.updatedAt
    }
}

export default UserDTO
