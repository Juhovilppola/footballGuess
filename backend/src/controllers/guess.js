const guessRouter = require('express').Router()
const Game = require('../models/games')
const middleware = require('../utils/middleware')
const usersRouter = require('./signUp')
//const User = require('../models/user')

/*guessRouter.get('/', async (request, response) => {
  const guesses = await User
    .find({}).populate('quess')
  response.json(games)
})*/


guessRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } /*else if (request.user.id != request.params.id) {
    return response.status(401).json({ error: 'ids does not match' })

  }*/

  console.log(body.guess)

  const guess = body.guess
  user.guess = guess
  await user.save()
  console.log('testi')



  response.status(201).json(user.guess)
})

module.exports = guessRouter