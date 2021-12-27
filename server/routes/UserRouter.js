const Router = require('express')
const userController = require('../controllers/userController')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkroleMiddleware')

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.get('/auth', authMiddleware, UserController.check)
router.put('/', checkRole(true), UserController.makeadmin)
router.get('/', checkRole(true), UserController.getNoSuperusers)
router.post('/auth0', UserController.loginauth0)

module.exports = router