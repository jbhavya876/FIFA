const mongoose = require('mongoose');
const User = require('../models/User');
const Team = require('../models/Team');
const TeamStats = require('../models/TeamStats');
const Fixture = require('../models/Fixture');

mongoose.Promise = global.Promise

module.exports = (settings) => {
  console.log("Connecting to database")
  /*mongoose.connect(settings.db)
  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }
    console.log('MongoDB ready!');
    User.seedAdminUser();
    Team.seedTeams();
    TeamStats.seedTeamStats();
    Fixture.seedEmptyFixtures();
  })
  db.on('error', err => console.log(`Database error: ${err}`))*/
}
