const Router = require('express')
const router = new Router()
const countryController = require('../controllers/countryController')
const checkRole = require('../middleware/checkroleMiddleware')

router.get('/', countryController.getAll)
router.post('/', checkRole(true), countryController.create)

module.exports = router