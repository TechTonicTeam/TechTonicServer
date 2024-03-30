const db = require('../db')

class PostService {
    async mergePostCommentLike(postList, user_id) { 
        const standartPosts = await Promise.all(postList.map(async (post) => {
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

    async updateLike(postId, userId, likes) {
        const like = await db.query(`SELECT likes from posts where id=($1)`, [postId])
        await db.query(`UPDATE posts SET likes=($1) where id=($2)`, [likes ? like.rows[0].likes + 1 : like.rows[0].likes - 1, postId])
        if (likes) {
            await db.query(`INSERT INTO likedPost (user_id, post_id) VALUES ($1, $2)`, [userId, postId])
        } else {
            await db.query(`DELETE from likedPost where post_id=($1) and user_id=($2)`, [postId, userId])
        }
    }
}

module.exports = new PostService()