const Router = require('express')
const router = new Router()
const reviewController = require('../controllers/reviewController')
const checkRole = require('../middleware/checkroleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:id',  reviewController.getAll)
router.post('/:id', authMiddleware, reviewController.create)
router.put('/:id', checkRole(true), reviewController.updateOne)
router.delete('/:id', checkRole(true), reviewController.deleteReview)

module.exports = router