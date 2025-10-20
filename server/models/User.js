const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  email: {type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true},
  username: {type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true},
  dateOfBirth: {type: mongoose.SchemaTypes.Date, required: REQUIRED_VALIDATION_MESSAGE},
  guessedSigns: {type: mongoose.SchemaTypes.Number, default: 0},
  guessedScores: {type: mongoose.SchemaTypes.Number, default: 0},
  points: {type: mongoose.SchemaTypes.Number, default: 0},
  salt: String,
  password: String,
  roles: [String]
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.password
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User
module.exports.seedAdminUser = () => {
  User.find({}).then(users => {
    if (users.length > 0) return

    let salt = encryption.generateSalt()
    let password = encryption.generateHashedPassword(salt, 'admin')

    User.create({
      email: 'admin@admin.com',
      username: 'Admin',
      dateOfBirth: '07-25-1986',
      salt: salt,
      password: password,
      roles: ['Admin']
    })
  })
}
