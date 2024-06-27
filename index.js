const express = require('express')
const cors = require('cors')
const userRoutes = require('./Routes/user.route')
const dotenv = require('dotenv')
const connectToDB = require('./Controllers/dbConnection')
const linkRoutes = require('./Routes/link.route')

app = express()


dotenv.config()

const PORT = process.env.PORT || 4000

app.use(cors())

app.use(express.json())


app.use('/user', userRoutes)

app.use('/link', linkRoutes)


app.listen(PORT, async () => {
  connectToDB()
  console.log(`Your server is running at : http://localhost:${PORT}`)
})


