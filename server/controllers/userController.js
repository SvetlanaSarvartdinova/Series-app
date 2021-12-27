const ApiError = require("../error/apiError")
const pool = require("../db");
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const generateJwt = (user_id, email, is_superuser) => {
    return jwt.sign(
        {user_id, email, is_superuser}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {username, password, email} = req.body
        if (!email || !password || !username) {
            return next(ApiError.badRequest('Заполните все поля'))
        }
        const candidate = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )
        if (candidate.rows.length !== 0) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        try {
        const hashPassword = await bcrypt.hash(password, 5)
        const id = uuid.v4()
        const user = await pool.query(
            "INSERT INTO users (user_id, username, password, email, is_superuser) VALUES ($1, $2, $3, $4, false) RETURNING *",
            [id, username, hashPassword, email]
        )
        const token = generateJwt(user.rows[0].user_id, user.rows[0].email, user.rows[0].is_superuser)
        return res.json({token})
        } catch(err) {
            next(ApiError.badRequest(err.message))
        }
    }
    async login(req, res, next) {
        const {password, email} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Заполните все поля'))
        }
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )
        if (user.rows.length === 0) {
            return next(ApiError.internal('Пользователя с таким email не существует'))
        }
        let comparePassword = bcrypt.compareSync(password, user.rows[0].password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.rows[0].user_id, user.rows[0].email, user.rows[0].is_superuser)
        return res.json({token})
    }
    async check(req, res) {
        const token = generateJwt(req.user.user_id, req.user.email, req.user.is_superuser)
        return res.json({token})
    }
    async getNoSuperusers(req, res) {
        const users = await pool.query(
            "SELECT email FROM users WHERE is_superuser=false"
        )
        res.json(users.rows)
    }
    async makeadmin(req, res) {
        const {email} = req.body
        const users = await pool.query(
            "UPDATE users SET is_superuser=true WHERE email = $1",
            [email]
        )
        return res.json(users.rows)
    }
    async loginauth0(req, res, next) {
        const {username, email} = req.body
        const candidate = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )
        if (candidate.rows.length === 0) {
            const password = "auth0"
            const id = uuid.v4()
            const user = await pool.query(
                "INSERT INTO users (user_id, username, password, email, is_superuser) VALUES ($1, $2, $3, $4, false) RETURNING *",
                [id, username, password, email]
            ) 
            const token = generateJwt(user.rows[0].user_id, user.rows[0].email, user.rows[0].is_superuser)
            return res.json({token})
        }
        else {
        const token = generateJwt(candidate.rows[0].user_id, candidate.rows[0].email, candidate.rows[0].is_superuser)
        return res.json({token})
        }
    }
}

module.exports = new UserController()