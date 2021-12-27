const uuid = require('uuid')
const path = require('path')
const ApiError = require("../error/apiError")
const pool = require("../db");

class userListsController {
    async addSerial(req, res, next) {
        try {
        const {id} = req.params
        const {is_viewed} = req.body 
        const user_id = req.user.user_id
        const add = await pool.query(
            "INSERT INTO user_lists (user_id, serial_id, is_viewed) VALUES ($1, $2, $3) RETURNING *",
            [user_id, id, is_viewed]
        )
        return res.json({'inlist': add.rows[0].is_viewed})
    } catch(err) {
        next(ApiError.badRequest(err.message))
    }
        }        
    async getViewed(req, res) {
        const {is_viewed} = req.query 
        const user_id = req.user.user_id
        const viewed = await pool.query(
            "SELECT serials.serial_id, name, description, content, genre_id, status, number_of_seasons, number_of_episodes, duration_of_episode, country_id, rating_IMDB, release_year, main_actors, resourse_url FROM user_lists INNER JOIN serials ON serials.serial_id = user_lists.serial_id WHERE user_id = $1 AND is_viewed = $2",
            [user_id, is_viewed]
        )
        return res.json(viewed.rows)
    }
    async deleteSerial(req, res) {
        try {
        const {id} = req.params
        const user_id = req.user.user_id
        const del = await pool.query(
            "DELETE FROM user_lists WHERE user_id = $1 AND serial_id = $2",
            [user_id, id]
        ) 
        return res.json({'inlist': -1})
    } catch(err) {
        next(ApiError.badRequest(err.message))
    }
    }
    async checkSerial(req, res, next) {
        try {
        const {id} = req.query
        const user_id = req.user.user_id
        const check = await pool.query(
            "SELECT * FROM user_lists WHERE serial_id = $1 AND user_id = $2",
            [id, user_id]
        )   
        if (check.rows.length !== 0) {
            return res.json({'inlist': check.rows[0].is_viewed})
        }  
        return res.json({'inlist': -1})
    } catch(err) {
        next(ApiError.badRequest(err.message))
    }
    } 
}

module.exports = new userListsController()