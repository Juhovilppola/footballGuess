const config = require('./utils/config')
const express = require('express')
//require('express-async-errors')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/signUp')
const leagueRouter = require('./controllers/league')
const gamesRouter = require('./controllers/games')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const guessRouter = require('./controllers/guess')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)


app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/league', leagueRouter)
app.use('/api/games', gamesRouter)
app.use('/api/guess', guessRouter)


/*if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}*/
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app