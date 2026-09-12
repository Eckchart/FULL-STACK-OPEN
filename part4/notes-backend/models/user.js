const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
    unique: true,  // makes a unique index on the username
    validate: {
      validator: function(v) {
        return /^[a-z_][a-z0-9_]*$/.test(v)
      }
    }
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})


module.exports = mongoose.model('User', userSchema)
