const db = require('../db')
const timers = require("timers");

class CommentController {
    async createComment(req, res) {
        try {
            const {title, post_id, user_id, timestamp} = req.body
            if (!title || !post_id || !user_id) {
                throw new Error("Неверные данные")
            }
            await db.query(`INSERT INTO comments (title, post_id, user_id, timestamp, likes) VALUES ($1, $2, $3, $4, $5)`, [title, post_id, user_id, timestamp, 0])
            res.json('комментарий создан')
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async likeComment(req, res) {
        try {

        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async dislikeComment(req, res) {
        try {

        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }
}

module.exports = new CommentController()