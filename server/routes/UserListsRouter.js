const Router = require('express')
const router = new Router()
const userListsController = require('../controllers/userListsController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, userListsController.getViewed)
router.post('/:id', authMiddleware, userListsController.addSerial)
router.delete('/:id', authMiddleware, userListsController.deleteSerial)
router.get('/check', authMiddleware, userListsController.checkSerial)
module.exports = router