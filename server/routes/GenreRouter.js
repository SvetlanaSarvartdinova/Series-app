const Router = require('express')
const router = new Router()
const genreController = require('../controllers/genreController')
const checkRole = require('../middleware/checkroleMiddleware')

router.get('/', genreController.getAll)
router.post('/', checkRole(true), genreController.create)

module.exports = router