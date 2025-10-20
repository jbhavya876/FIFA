const express = require('express');
const router = new express.Router();
const TeamStats = require('../models/TeamStats');
const User = require('../models/User');
const DbErrorMsg = 'A database error occured';

router.get('/club', async (req, res, ) => {
  try {
    let teamsWithStats = await TeamStats.find({}).populate('team')

    if (teamsWithStats.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No teams in database',
        data: {}
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Inside standings',
      data: teamsWithStats
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: DbErrorMsg,
      data: {}
    })
  }

});

router.get('/user', async (req, res) => {
  try {
    let users = await User.find({}, 'username guessedSigns guessedScores points')

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users are currently betting',
        data: {}
      })
    }

    return res.status(200).json({
      success: true,
      message: '',
      data: users
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: DbErrorMsg,
      data: {}
    })
  }
});

module.exports = router 
