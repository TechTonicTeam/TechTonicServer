const db = require('../db')
const CommentService = require('../services/comment-service')

class CommentController {
    async createComment(req, res, next) {
        try {
            const {title, post_id, user_id, timestamp} = req.body
            if (!title || !post_id || !user_id || !timestamp) {
                throw new Error("Неверные данные")
            }
            await db.query(`INSERT INTO comments (title, post_id, user_id, timestamp, likes) VALUES ($1, $2, $3, $4, $5)`, [title, post_id, user_id, timestamp, 0])
            res.json('комментарий создан')
        } catch (e) {
            next(e)
        }
    }

    async likeComment(req, res, next) {
        try {
            const {user_id, comment_id} = req.query
            await CommentService.updateLike(user_id, comment_id, true)
            res.json('Комменты обновлены')
        } catch (e) {
            next(e)
        }
    }

    async dislikeComment(req, res, next) {
        try {
            const {user_id, comment_id} = req.query
            await CommentService.updateLike(user_id, comment_id, false)
            res.json('Комменты обновлены')
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CommentController()