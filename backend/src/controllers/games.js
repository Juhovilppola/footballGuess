const gamesRouter = require('express').Router()
const Game = require('../models/games')
const middleware = require('../utils/middleware')

gamesRouter.get('/', async (request, response) => {
  const games = await Game
    .find({}).populate('home', 'guest')
  response.json(games)
})

gamesRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (!user.admin) {
    return response.status(401).json({ error: 'Only admin can add games' })

  }



  const game = new Game({
    home: body.home,
    guest: body.guest,
    time: body.time,
    result: body.result,
    gameOrder: body.order
  })
  const savedgame = await game.save()

  response.status(201).json(savedgame)
})

gamesRouter.post('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const game = await Game.findById(request.params.id)
  const user = request.user
  console.log(request.params.id)
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (!user.admin) {
    return response.status(401).json({ error: 'Only admin can edit games' })

  }



  const update = {
    home: game.home,
    guest: game.guest,
    time: game.time,
    result: body.result,
    gameOrder: game.order
  }
  const updatedGame = await Game.findByIdAndUpdate(request.params.id, update)
  response.json(updatedGame)


})


module.exports = gamesRouter
