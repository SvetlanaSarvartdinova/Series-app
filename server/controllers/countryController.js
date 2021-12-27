const ApiError = require("../error/apiError")
const pool = require("../db");

class CountryController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const newcountry = await pool.query(
                "INSERT INTO countries (country_name) VALUES ($1) RETURNING *",
                [name]
            )
            return res.json(newcountry.rows)
        } catch (err) {
            next(ApiError.badRequest(err.message))
        }
    }
    async getAll(req, res) {
        const countries = await pool.query(
            "SELECT * FROM countries"
        )
        res.json(countries.rows)
    }
}

module.exports = new CountryController()