const uuid = require('uuid')
const path = require('path')
const db = require('../db')
const ApiError = require('../exciptions/api-error')
const PostService = require('../services/post-service')
class postController {
    async createPost(req, res, next) {
        try {
            const {title, user_id, timestamp} = req.body
            if (!title || !user_id || !timestamp) {
                throw new ApiError.BadRequest("Данные введены неверно")
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
            next(e)
        }
    }

    async getPost(req, res, next) {
        try {
            const {sorting, user_id} = req.query
            switch (sorting) {
                case "Сначала популярные":
                    const posts = await db.query(`SELECT * from posts ORDER BY likes DESC`)
                    const popularPost = await PostService.mergePostCommentLike(posts.rows, user_id)
                    res.json(popularPost)
                    break;

                case "Сначала старые":
                    const descPost = await db.query(`SELECT * from posts ORDER BY id ASC`)
                    const olderPost = await PostService.mergePostCommentLike(descPost.rows, user_id)
                    res.json(olderPost)
                    break;

                case "Сначала мои предложения":
                    const myPosts = await db.query(`SELECT * from posts where user_id=($1)`, [user_id])
                    const withOutMyPost = await db.query(`SELECT * from posts where user_id!=($1)`, [user_id])
                    const allPost = [
                        ...myPosts.rows.reverse(),
                        ...withOutMyPost.rows.reverse()
                    ]
                    const allMyPost = await PostService.mergePostCommentLike(allPost, user_id)
                    console.log("dsd")
                    res.json(allMyPost)
                    break;
                default:
                    const standartPost = await db.query(`SELECT * from posts ORDER BY id DESC`)
                    const newPosts = await PostService.mergePostCommentLike(standartPost.rows, user_id)
                    res.json(newPosts)
                    break;
            }
        } catch (e) {
            next(e)
        }
    }

    async incrementLike(req, res, next) {
        try {
            const {post_id, user_id} = req.body
            await PostService.updateLike(post_id, user_id, true)
            res.json('Лайки обновлены')
        } catch (e) {
            next(e)
        }
    }

    async decrementLike(req, res, next) {
        try {
            const {post_id, user_id} = req.body
            await PostService.updateLike(post_id, user_id, false)
            res.json('Лайки обновлены')
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new postController()