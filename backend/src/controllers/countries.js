const countriesRouter = require('express').Router()
const Countries = require('../models/countries')
const middleware = require('../utils/middleware')

countriesRouter.get('/', async (request, response) => {
  const countries = await Countries
    .find({}).populate('country')
  response.json(countries)
})

countriesRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (!user.admin) {
    return response.status(401).json({ error: 'Only admin can add countries' })

  }



  const country = new Countries({
    country: body.country
  })
  const savedcountry = await country.save()

  response.status(201).json(savedcountry)
})

countriesRouter.post('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const country = await Countries.findById(request.params.id)
  const user = request.user
  console.log(request.params.id)
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (!user.admin) {
    return response.status(401).json({ error: 'Only admin can edit countries' })

  }



  const update = {
    country: country.country,
    placement: body.placement

  }
  const updatedCountry = await Countries.findByIdAndUpdate(request.params.id, update)
  response.json(updatedCountry)


})



module.exports = countriesRouter