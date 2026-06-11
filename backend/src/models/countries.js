const mongoose = require('mongoose')

const countriesSchema = mongoose.Schema({
  country: {
    type: String,
    required: true
  },

  placement: Number

})


countriesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('countries', countriesSchema)