const leagueRouter = require('express').Router()
const League = require('../models/leagues')
const middleware = require('../utils/middleware')

leagueRouter.get('/', async (request, response) => {
  const leagues = await League
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(leagues)
})


leagueRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }



  const league = new League({
    title: body.title,
    playerCount: 1,
    creator: user._id,
  })
  const savedLeague = await league.save()
  user.leagues = user.leagues.concat(savedLeague._id)
  await user.save()
  response.status(201).json(savedLeague)
})

leagueRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const league = await League.findById(request.params.id)
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (league.creator.toString() === user._id.toString()) {
    await League.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).end()
  }



})

leagueRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const league = await League.findById(request.params.id)
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  var userId = user._id.toString()
  var users = league.users
  users.push(user._id)
  console.log(users)

  const update = {
    title: league.title,
    creator: league.creator,
    users: users
  }

  const updatedLeague = await League.findByIdAndUpdate(request.params.id, update, { new: user._id })
  user.leagues = user.leagues.concat(updatedLeague._id)
  await user.save()
  response.json(updatedLeague)

})

module.exports = leagueRouter
