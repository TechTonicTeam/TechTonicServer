const tokenService = require('../services/token-service')

module.exports = function(req, res, next) {
    try {
        const authToken = req.headers.authorization
        if (!authToken) { 
            return next("Не авторизирован")
        }
        
        const accessToken = authToken.split(' ')[1]
        if (!accessToken) {
            return next("Не авторизирован")
        }
        
        const user = tokenService.verifyAccessToken(accessToken)
        if (!user) {
            return next("Не авторизирован")
        }

        req.user = user
        next()
    } catch (e) {
        return next("Не авторизирован")
    }
}