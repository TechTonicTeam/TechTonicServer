const db =  require('../db.js')

class UserController {
    async createUser(req, res) {
        const {name, email} = req.body
        const newUser = await db.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email])
        res.json(newUser)
    }

    async getUser(req, res) {
        const {email} = req.query
        const user = await db.query(`SELECT id, name, email, picture FROM users WHERE email=($1)`, [email])
        res.json(user.rows[0])
    }

    async setPictureUser(req, res) {
        const {id, picture} = req.body
        console.log(req.body)
        db.query(`UPDATE users SET picture=($1) WHERE id=($2)`, [picture, id])
        res.json("Пользователь обновлен!")
    }
}

module.exports = new UserController()