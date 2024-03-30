const db = require('../db')

class CommentService { 
    async updateLike(user_id, comment_id, likes) { 
        const like = await db.query(`SELECT likes from comments where id=($1)`, [comment_id])
        await db.query(`UPDATE comments SET likes=($1) where id=($2)`, [likes ? like.rows[0].likes+1 : like.rows[0].likes-1, comment_id])
        if (likes) {
            await db.query(`INSERT INTO likedComment (user_id, comment_id) VALUES ($1, $2)`, [user_id, comment_id])
        } else {
            await db.query(`DELETE from likedComment where comment_id=($1) and user_id=($2)`, [comment_id, user_id])
        }
    }
}

module.exports = new CommentService()