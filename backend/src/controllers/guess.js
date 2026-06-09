const guessRouter = require('express').Router()
const Game = require('../models/games')
const middleware = require('../utils/middleware')
const usersRouter = require('./signUp')
const Status = require('../models/status')
const User = require('../models/user')


guessRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  response.json(user.guess)
})


guessRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const status = await Status.findById("6a280cf18adbc119a04926d9")
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!status.status) {
    return response.status(401).json({ error: 'guessing is locked' })
  }


  console.log(body.guess)

  const guess = body.guess
  user.guess = guess
  await user.save()
  console.log('testi')



  response.status(201).json(user.guess)
})

module.exports = guessRouter