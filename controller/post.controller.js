const uuid = require('uuid')
const path = require('path')
const db = require('../db')
class postController {
    async createPost(req, res) {
        try {
            const {title, user_id, timestamp} = req.body
            if (!title || !user_id || !timestamp) {
                throw new Error("Неверные данные")
            }

            if (!!req.files) {
                const picture = req.files.file
                const fileType = picture.mimetype.substring(picture.mimetype.search('/') + 1)
                let fileName = uuid.v4() + `.${fileType}`
                picture.mv(path.resolve(__dirname, '..', 'static/post', fileName))
                await db.query(`INSERT INTO posts (title, picture, timestamp, user_id, likes) VALUES ($1, $2, $3, $4, $5)`, [title, fileName, timestamp, parseInt(user_id), 0])
            } else {
                await db.query(`INSERT INTO posts (title, timestamp, user_id, likes) VALUES ($1, $2, $3, $4)`, [title, timestamp, parseInt(user_id), 0])
            }
            res.json("Пост создан")
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async getPost(req, res) {
        try {
            const {user_id} = req.query
            const posts = await db.query(`SELECT * from posts`)
            const currentPost = await Promise.all(posts.rows.map(async (post) => {
                const user = await db.query(`SELECT name, picture from users WHERE id=($1)`, [post.user_id])
                const like = await db.query(`SELECT * from likedPost where post_id=($1) and user_id=($2)`, [post.id, user_id])
                return {...post, user: {...user.rows[0]}, liked: !!like.rows[0]}
            }))
            res.json(currentPost.reverse())
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async incrementLike(req, res) {
        try {
            const {postId, userId} = req.body
            const like = await db.query(`SELECT likes from posts where id=($1)`, [postId])
            await db.query(`UPDATE posts SET likes=($1) where id=($2)`, [like.rows[0].likes + 1, postId])
            await db.query(`INSERT INTO likedPost (user_id, post_id) VALUES ($1, $2)`, [userId, postId])
            res.json('Лайки обновлены')
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async decrementLike(req, res) {
        try {
            const {postId, userId} = req.body
            const like = await db.query(`SELECT likes from posts where id=($1)`, [postId])
            await db.query(`UPDATE posts SET likes=($1) where id=($2)`, [like.rows[0].likes-1, postId])
            await db.query(`DELETE from likedPost where post_id=($1) and user_id=($2)`, [postId, userId])
            res.json('Лайки обновлены')
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }
}

module.exports = new postController()