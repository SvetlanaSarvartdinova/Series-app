const ApiError = require("../error/apiError")
const pool = require("../db");

class ReviewController {
    async getAll(req, res, next) {
        const {id} = req.params
        const review = await pool.query(
            "SELECT review_id, serial_id, username, text_rew, rating FROM reviews INNER JOIN users ON users.user_id = reviews.user_id WHERE serial_id = $1",
            [id]
        )
        return res.json(review.rows)
    }
    async create(req, res, next) {
        try {
        const {id} = req.params
        const {text_rew, rating} = req.body 
        const user_id = req.user.user_id
        const review = await pool.query(
            "INSERT INTO reviews (serial_id, user_id, text_rew, rating) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, user_id, text_rew, rating]
        )
        return res.json(review)
        } catch (err) {
            next(ApiError.badRequest(err.message))
        } 
    }
    async updateOne(req, res, next) {
        try {
            const {id} = req.params
            const {text_rew} = req.body 
            const review = await pool.query(
                "UPDATE reviews SET text_rew = $1 WHERE review_id = $2",
                [text_rew, id]
            )
            return res.json(review)
            } catch (err) {
                next(ApiError.badRequest(err.message))
        }         
    }
    async deleteReview(req, res, next) {
        const {id} = req.params
        const del_rew = await pool.query(
            "DELETE FROM reviews WHERE review_id = $1",
            [id]
        )      
    }
}

module.exports = new ReviewController()