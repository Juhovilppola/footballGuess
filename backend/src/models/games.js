const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
  home: {
    type: String,
    required: true
  },
  guest: {
    type: String,
    required: true
  },
  Time: String,
  result: [Number]
})


blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Game', gameSchema)