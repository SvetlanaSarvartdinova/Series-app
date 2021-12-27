const Router = require('express')
const router = new Router()
const serialController = require('../controllers/serialController')
const checkRole = require('../middleware/checkroleMiddleware')

router.get('/', serialController.getAll)
router.post('/', checkRole(true), serialController.create)
router.get('/:id', serialController.getOne)
router.put('/:id', checkRole(true), serialController.updateOne)

module.exports = router