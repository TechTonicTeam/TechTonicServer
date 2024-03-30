const ApiError = require('../exciptions/api-error')
const tokenService = require('../services/token-service')

module.exports = function(req, res, next) {
    try {
        const authToken = req.headers.authorization
        if (!authToken) { 
            return next(ApiError.UnauthorizedError())
        }
        
        const accessToken = authToken.split(' ')[1]
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }
        
        const user = tokenService.verifyAccessToken(accessToken)
        if (!user) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = user
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}