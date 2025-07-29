const mongoose = require('mongoose')

const leagueSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  playerCount: Number,

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

leagueSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('League', leagueSchema)