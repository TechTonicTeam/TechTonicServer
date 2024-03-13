const db =  require('../db.js')
const bcrypt = require('bcrypt')

class UserController {
    async createUser(req, res) {
        try {
            const {name, email} = req.body
            if (!name || !email) {
                throw new Error("Введены неверные данные")
            }
            const currentUser = await db.query(`SELECT * from users where email=($1)`, [email])
            if (currentUser.rows[0]) {
                throw new Error("Пользователь уже существует!")
            }
            const newUser = await db.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`, [name, email])
            res.json(newUser)
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async createAdmin(req, res) {
        try {
            const {email, password} = req.body
            if (!email || !password) {
                throw new Error("Введены неверные данные")
            }
            const currentUser = await db.query(`SELECT * from users where email=($1)`, [email])
            if (currentUser.rows[0]) {
                throw new Error("Пользователь уже существует!")
            }
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)
            await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, ['ADMIN', email, passwordHash])
            res.json('Админ создан')
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async adminLogin(req, res) {
        try {
            const {email, password} = req.query
            if (!email || !password) {
                throw new Error("Не введены данные")
            }
            const hash = await db.query(`SELECT id, password from users where email=($1)`, [email])
            if (hash.rows[0]) {
                const truePassword = await bcrypt.compare(password, hash.rows[0].password)
                res.json({truePassword, id: hash.rows[0].id})
            } else {
                throw new Error("Ошибка")
            }
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async getUser(req, res) {
        try {
            const {email} = req.query
            const user = await db.query(`SELECT id, name, email, picture, password FROM users WHERE email=($1)`, [email])
            if (!!user.rows[0].password) {
                throw new Error("")
            }
            res.json(user.rows[0])
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }

    async setPictureUser(req, res) {
        try {
            const {id, picture} = req.body
            db.query(`UPDATE users SET picture=($1) WHERE id=($2)`, [picture, id])
            res.json("Пользователь обновлен!")
        } catch (e) {
            console.log(e.message)
            res.json(e.message)
        }
    }
}

module.exports = new UserController()