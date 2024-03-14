const db = require('../db')

class CommentController {
    async createComment(req, res) {
        try {
            const {title, post_id, user_id, timestamp} = req.body
            if (!title || !post_id || !user_id || !timestamp) {
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
            const {user_id, comment_id} = req.body
            const like = await db.query(`SELECT likes from comments where id=($1)`, [comment_id])
            await db.query(`UPDATE comments SET likes=($1) where id=($2)`, [like.rows[0].likes+1, comment_id])
            await db.query(`INSERT INTO likedComment (user_id, comment_id) VALUES ($1, $2)`, [user_id, comment_id])
            res.json('Комменты обновлены')
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async dislikeComment(req, res) {
        try {
            const {user_id, comment_id} = req.body
            const like = await db.query(`SELECT likes from comments where id=($1)`, [comment_id])
            await db.query(`UPDATE comments SET likes=($1) where id=($2)`, [like.rows[0].likes-1, comment_id])
            await db.query(`DELETE from likedComment where comment_id=($1) and user_id=($2)`, [comment_id, user_id])
            res.json('Комменты обновлены')
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }
}

module.exports = new CommentController()