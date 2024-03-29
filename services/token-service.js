const jwt = require('jsonwebtoken')
const db = require('../db')

class TokenService {
    generateToken(payload) { 
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) { 
        const tokenData = await db.query(`SELECT token from tokens where user_id=($1)`, [userId])
        if (tokenData) {
            await db.query(`INSERT INTO tokens (user_id, token) VALUES ($1, $2)`, [userId, refreshToken])
        }
    }

    verifyAccessToken(accessToken) {
        const user = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        return user
    }

    verifyRefreshToken(refreshToken) {
        const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        return user
    }
}

module.exports = new TokenService();