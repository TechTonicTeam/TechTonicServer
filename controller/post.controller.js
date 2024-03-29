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
            const {sorting, user_id} = req.query
            async function currentPost(posts) {
                const standartPosts = await Promise.all(posts.map(async (post) => {
                    const comments = await db.query(`SELECT * from comments where post_id=($1)`, [post.id])
                    const currentComment = await Promise.all(comments.rows.map(async (comment) => {
                        const userComment = await db.query(`SELECT name, picture from users where id=($1)`, [comment.user_id])
                        const likedComment = await db.query(`SELECT * from likedComment where user_id=($1) and comment_id=($2)`, [user_id, comment.id])
                        return {...comment, user: {...userComment.rows[0]}, liked: !!likedComment.rows[0]}
                    }))
                    const user = await db.query(`SELECT name, picture from users WHERE id=($1)`, [post.user_id])
                    const like = await db.query(`SELECT * from likedPost where post_id=($1) and user_id=($2)`, [post.id, user_id])
                    return {...post, user: {...user.rows[0]}, comment: currentComment, liked: !!like.rows[0]}
                }))
                return standartPosts
            }

            switch (sorting) {
                case "Сначала популярные":
                    const posts = await db.query(`SELECT * from posts ORDER BY likes DESC`)
                    const popularPost = await currentPost(posts.rows)
                    res.json(popularPost)
                    break;

                case "Сначала старые":
                    const descPost = await db.query(`SELECT * from posts ORDER BY id ASC`)
                    const olderPost = await currentPost(descPost.rows)
                    res.json(olderPost)
                    break;

                case "Сначала мои предложения":
                    const myPosts = await db.query(`SELECT * from posts where user_id=($1)`, [user_id])
                    const withOutMyPost = await db.query(`SELECT * from posts where user_id!=($1)`, [user_id])
                    const allPost = [
                        ...myPosts.rows.reverse(),
                        ...withOutMyPost.rows.reverse()
                    ]
                    const allMyPost = await currentPost(allPost)
                    res.json(allMyPost)
                    break;
                default:
                    const standartPost = await db.query(`SELECT * from posts ORDER BY id DESC`)
                    const newPosts = await currentPost(standartPost.rows)
                    res.json(newPosts)
                    break;
            }
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