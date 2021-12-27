const Router = require('express')
const router = new Router()
const ReviewRouter = require('./ReviewRouter')
const UserRouter = require('./UserRouter')
const SerialRouter = require('./SerialRouter')
const GenreRouter = require('./GenreRouter')
const CountryRouter = require('./CountryRouter')
const UserListsRouter = require('./UserListsRouter')

router.use('/user', UserRouter)
router.use('/serial', SerialRouter)
router.use('/reviews', ReviewRouter)
router.use('/genre', GenreRouter)
router.use('/country', CountryRouter)
router.use('/userlists', UserListsRouter)

module.exports = router