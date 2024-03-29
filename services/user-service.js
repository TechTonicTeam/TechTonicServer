const db = require('../db')
const tokenService = require('../services/token-service')

class UserService {
    async refresh(req, res) { 
        try {
            const refreshToken = req.cookie('refreshToken')
            if (!refreshToken) {
                throw new Error('Не авторизован 401')
            }
            const validateToken = tokenService.verifyRefreshToken(refreshToken)
            const refreshTokenFromDB = await db.query(`SELECT token FROM tokens WHERE user_id=($1)`, [validateToken.id])
            if (!validateToken || !refreshTokenFromDB) {
                throw new Error('Не авторизован 401')
            }
            const currentUser = await db.query(`SELECT * FROM users WHERE id=($1)`, [validateToken.id])
            const tokens = tokenService.generateToken(currentUser)
            tokenService.saveToken(currentUser.id, tokens.refreshToken)
            return {...tokens, user: currentUser}
        } catch (e) {
            console.log(e.message)
        }
    }
}

module.exports = new UserService()