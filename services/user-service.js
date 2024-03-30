const db = require('../db')
const tokenService = require('../services/token-service')
const bcryptjs = require('bcryptjs')

class UserService {
    async createHashPassword(password) {
        const salt = await bcryptjs.genSalt(10)
        const passwordHash = await bcryptjs.hash(password, salt)
        return passwordHash
    }

    async createNewUser(name, email, passwordHash, adminRole) {
        let newUser;
        if (adminRole) {
            newUser = await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, passwordHash])
        } else {
            newUser = await db.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email])
        }
        return newUser
    }

    async genTokens(userId, email, adminRole) { 
        const tokens = tokenService.generateToken({id: userId, email, admin: adminRole})
        await tokenService.saveToken(userId, tokens.refreshToken)
        return tokens
    }
}

module.exports = new UserService()