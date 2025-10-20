const express = require('express');
const Fixture = require('../models/Fixture');
const UserBets = require('../models/UserBets');

const router = new express.Router();

router.get('/get-active-round', async (req, res) => {
    let activeFixtures = await Fixture
        .find({ 'isActive': true })
        .populate({
            path: 'gameStats',
            model: 'Game',
            populate: {
                path: 'homeTeamId awayTeamId',
                model: 'Team'
            }
        });

    if (activeFixtures.length !== 1) {
        return res.status(200).json({
            success: false,
            message: 'There is no active round currently, please come back again later!',
            data: {}
        });
    }    

    let activeFixture = activeFixtures[0];

    if(activeFixture.betsAcceptedBy < Date.now()) {
        return res.status(200).json({
            success: false,
            message: 'Sorry, we are no longer accepting bets for this round',
            data: {}
        });
    }

    //Check if user already bet for this round
    const userId = req.user._id;
    const gameIds = activeFixture.gameStats.map(g => g._id)

    let existingBets = await UserBets.find({
        userId: userId,
        gameId: { $in: gameIds }
    })

    if (existingBets.length > 0) {
        activeFixture = JSON.stringify(activeFixture);
        activeFixture = JSON.parse(activeFixture);
        activeFixture.gameStats = GetGameStatsWithExistingBets(activeFixture, existingBets)
    }

    return res.status(200).json({
        success: true,
        message: ``,
        data: activeFixture
    });
})

function GetGameStatsWithExistingBets(fixture, bets) {
    let arr = [];

    for (let game of fixture.gameStats) {
        //game.toObject();

        let bet = bets.filter(b => b.gameId == game._id)[0];

        game['homeTeamGoals'] = bet.homeTeamGoals
        game['awayTeamGoals'] = bet.awayTeamGoals

        arr.push(game);
    }
    return arr;
}

router.post('/submit', async (req, res) => {
    const userId = req.user._id;
    const gameIds = Object.values(req.body)
        .filter(g => g.gameId !== '')
        .map(g => g.gameId);

    try {
        //delete existing bets if any
        await UserBets.remove({
            userId: userId,
            gameId: { $in: gameIds }
        })

        //create new bets
        for (let game of Object.values(req.body)) {
            game.userId = userId;
            await new UserBets(game).save();
        }

        return res.status(200).json({
            success: true,
            message: ``,
            data: {}
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err,
            data: {}
        })
    }
})

module.exports = router;