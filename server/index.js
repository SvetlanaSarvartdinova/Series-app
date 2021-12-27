const express = require('express')
const cors = require('cors')
const pool = require("./db")
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000
  

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.listen(PORT, () => console.log(`server has started on port ${PORT}`))

//Обработка ошибок
app.use(errorHandler)