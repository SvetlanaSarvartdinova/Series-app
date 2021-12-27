const uuid = require('uuid')
const path = require('path')
const ApiError = require("../error/apiError")
const pool = require("../db");

class SerialController {
    async create(req, res, next) {
        try {
            const {name, description, genre_id, status, number_of_seasons, number_of_episodes, duration_of_episode, country_id, rating_IMDB, release_year, main_actors, resourse_url} = req.body;
            const {content} = req.files
            let fileName = uuid.v4() + '.jpg'
            content.mv(path.resolve(__dirname, '..', 'static', fileName))
            const newSerial = await pool.query(
                "INSERT INTO serials (name, description, content, genre_id, status, number_of_seasons, number_of_episodes, duration_of_episode, country_id, rating_IMDB, release_year, main_actors, resourse_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", 
                [name, description, fileName, genre_id, status, number_of_seasons, number_of_episodes, duration_of_episode, country_id, rating_IMDB, release_year, main_actors, resourse_url]
            )   
            return res.json(newSerial.rows)
        } catch(err) {
            next(ApiError.badRequest(err.message))
        }
    }
    async getAll(req, res) {
        let {genre_id, country_id, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let serials;
        if (!genre_id && !country_id) {
            serials = await pool.query(
                "SELECT * FROM serials LIMIT $1 OFFSET $2", 
                [limit, offset]
            )
        }
        if (genre_id && !country_id) {
            serials = await pool.query(
                "SELECT * FROM serials WHERE genre_id = $1 LIMIT $2 OFFSET $3",
                [genre_id, limit, offset]
            )
        }
        if (!genre_id && country_id) {
            serials = await pool.query(
                "SELECT * FROM serials WHERE country_id = $1 LIMIT $2 OFFSET $3",
                [country_id, limit, offset]
            )
        }
        if (genre_id && country_id) {
            serials = await pool.query(
                "SELECT * FROM serials WHERE country_id = $1 AND genre_id = $2 LIMIT $3 OFFSET $4",
                [country_id, genre_id, limit, offset]
            )
        }
        res.json(serials.rows)
    }
    async getOne(req, res) {
        const {id} = req.params
        const serial = await pool.query(
            "SELECT serial_id, name, description, content, genre_name, status, number_of_seasons, number_of_episodes, duration_of_episode, country_name, rating_IMDB, release_year, main_actors, resourse_url FROM serials INNER JOIN genres ON genres.genre_id = serials.genre_id INNER JOIN countries ON countries.country_id = serials.country_id WHERE serial_id = $1",
            [id]
        )
        return res.json(serial.rows[0])
        
    }
    async updateOne(req, res) {
        try {
        const {id} = req.params
        let {number_of_seasons, number_of_episodes, status, rating_IMDB, main_actors} = req.body
        let serials = await pool.query(
            "UPDATE serials SET status = $1, number_of_seasons = $2, number_of_episodes = $3, rating_imdb = $4, main_actors = $5 WHERE serial_id = $6",
            [status, number_of_seasons, number_of_episodes, rating_IMDB, main_actors, id]
        )
        return res.json(serials.rows) 
    } catch(err) {
        next(ApiError.badRequest(err.message))
    }     
    }
}

module.exports = new SerialController()