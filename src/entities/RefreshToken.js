class RefreshToken {

    constructor({
        token,
        userId
    }) {
        this.token = token
        this.userId = userId
        this.createdAt = new Date()
    }

}

module.exports = RefreshToken