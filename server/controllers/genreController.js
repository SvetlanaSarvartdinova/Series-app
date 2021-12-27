const ApiError = require("../error/apiError")
const pool = require("../db");

class GenreController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const newgenre = await pool.query(
                "INSERT INTO genres (genre_name) VALUES ($1) RETURNING *",
                [name]
            )   
            return res.json(newgenre.rows)
        } catch (err) {
            next(ApiError.badRequest(err.message))
        }
    }
    async getAll(req, res) {
        const genres = await pool.query(
            "SELECT * FROM genres"
        )
        res.json(genres.rows)
    }
}

module.exports = new GenreController()