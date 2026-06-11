const leagueRouter = require('express').Router()
const League = require('../models/leagues')
const middleware = require('../utils/middleware')
const bcrypt = require('bcrypt')

leagueRouter.get('/', async (request, response) => {
  const leagues = await League
    .find({}).populate('title')
  response.json(leagues)
})

// Uuden liigan luonti
leagueRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const title = body.title

  const user = request.user

  const existingLeague = await League.findOne({ title })
  if (existingLeague) {
    return response.status(400).json({
      error: 'league name must be unique'
    })
  }
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const password = body.password

  if (!password) {
    return response.status(401).json({ error: 'password missing' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)



  const league = new League({
    title: body.title,
    playerCount: 1,
    creator: user._id,
    status: body.status,
    passwordHash: passwordHash

  })
  const savedLeague = await league.save()
  user.leagues = user.leagues.concat(savedLeague._id)
  await user.save()
  response.status(201).json(savedLeague)
})

//poista olemassa oleva liiga (vain liigan luoja pystyy poistamaan)
leagueRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const league = await League.findById(request.params.id)
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!league) {
    return response.status(401).json('League has already been deleted')
  }
  if (league.creator.toString() === user._id.toString()) {
    await League.findByIdAndDelete(request.params.id)
    return response.status(201).json('League deleted')
  } else {
    return response.status(401).json('Only league creator can delete league')
  }



})
//Liigan luoja pystyy muokkaamaan liigan avoimuutta
leagueRouter.post('/:id', middleware.userExtractor, async (request, response) => {
  const league = await League.findById(request.params.id)
  const user = request.user
  const body = request.body
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (league.creator.toString() === user._id.toString()) {

    const password = body.password

    if (!password) {
      return response.status(401).json({ error: 'password missing' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)



    const update = {
      title: league.title,
      creator: league.creator,
      status: body.status,
      passwordHash: passwordHash,
      users: league.users


    }
    const updatedLeague = await League.findByIdAndUpdate(request.params.id, update)
    response.status(201).json(updatedLeague)
  } else {
    return response.status(401).json('Only league creator can delete league')
  }



})
//liittyminen liigaan
leagueRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const league = await League.findById(request.params.id)
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const password = request.body.password
  if (league.status === "closed") {
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, league.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid password'
      })
    }
  }
  const userAlreadyJoined = league.users.find((element) => element == user._id.toString())
  if (userAlreadyJoined) {
    return response.status(400).json({
      error: 'User has already joined this league'
    })
  }
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
//poistaa käyttäjän liigasta
leagueRouter.delete('/:id/user', middleware.userExtractor, async (request, response) => {
  const league = await League.findById(request.params.id)
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //tarkasta onko käyttäjä liigassa
  const userAlreadyJoined = league.users.find((element) => element == user._id.toString())
  if (!userAlreadyJoined) {
    return response.status(400).json({
      error: 'User is not in this league'
    })
  }

  var users = league.users.remove(user._id)

  const update = {
    title: league.title,
    creator: league.creator,
    users: users
  }

  const updatedLeague = await League.findByIdAndUpdate(request.params.id, update)
  user.leagues = user.leagues.remove(updatedLeague._id)
  await user.save()
  response.json(updatedLeague)
  response.status(204).end()







})


module.exports = leagueRouter
