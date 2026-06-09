const statusRouter = require('express').Router()
const Status = require('../models/status')
const middleware = require('../utils/middleware')

statusRouter.get('/', async (request, response) => {
  const status = await Status
    .find({}).populate('status')
  response.json(status)
})

// statuksen muokkaus
statusRouter.post('/:id', middleware.userExtractor, async (request, response) => {

  const status = await Status.findById(request.params.id)
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (!user.admin) {
    return response.status(401).json({ error: 'only admin can edit status' })
  }

  if (status.status) {
    status.status = false
  } else if (!status.status) {
    status.status = true
  } else {
    return response.status(401).json({ error: 'error editing status' })
  }
  const savedStatus = await status.save()


  response.status(201).json(savedStatus)
})

module.exports = statusRouter