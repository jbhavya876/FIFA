import React, { Component } from 'react';
import { toast } from 'react-toastify';
import GamePair from '../common/game-pair';
import BetsService from '../../services/bets-service';

const SuccessMsg = 'Your bets have been successfully submitted';

class PlaceBetsForm extends Component {
    static BetsService = new BetsService();

    constructor(props) {
        super(props)

        const gameStats = this.props.fixture.gameStats;

        this.state = {
            home_1: gameStats[0].homeTeamGoals || '', away_1: gameStats[0].awayTeamGoals || '', id_1: gameStats[0]._id,
            home_2: gameStats[1].homeTeamGoals || '', away_2: gameStats[1].awayTeamGoals || '', id_2: gameStats[1]._id,
            home_3: gameStats[2].homeTeamGoals || '', away_3: gameStats[2].awayTeamGoals || '', id_3: gameStats[2]._id,
            home_4: gameStats[3].homeTeamGoals || '', away_4: gameStats[3].awayTeamGoals || '', id_4: gameStats[3]._id,
            home_5: gameStats[4].homeTeamGoals || '', away_5: gameStats[4].awayTeamGoals || '', id_5: gameStats[4]._id,
            home_6: gameStats[5].homeTeamGoals || '', away_6: gameStats[5].awayTeamGoals || '', id_6: gameStats[5]._id,
            home_7: gameStats[6].homeTeamGoals || '', away_7: gameStats[6].awayTeamGoals || '', id_7: gameStats[6]._id,
            home_8: gameStats[7].homeTeamGoals || '', away_8: gameStats[7].awayTeamGoals || '', id_8: gameStats[7]._id,
            home_9: gameStats[8].homeTeamGoals || '', away_9: gameStats[8].awayTeamGoals || '', id_9: gameStats[8]._id,
            home_10: gameStats[9].homeTeamGoals || '', away_10: gameStats[9].awayTeamGoals || '', id_10: gameStats[9]._id,
        }
    }

    showError = (error) => {
        toast.error(error);
    }

    showSuccess = (message) => {
        toast.success(message);
    }

    handleChange = (event, gameId) => {
        const [homeOrAway, gameNum] = event.target.id.split('_');

        this.setState({
            [`id_${gameNum}`]: gameId,
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const values = Object.values(this.state);
        if (values.filter(v => v === '').length) {
            this.showError('All scores are required');
            return;
        }

        let reqBody = this.transformStateToRequestBody();

        try {
            var response = await PlaceBetsForm.BetsService.submitBets(reqBody);
            if (!response.success) {
                throw new Error(response.message);
            }

            this.showSuccess(SuccessMsg);

        } catch (err) {
            this.showError(err.message)
        }
    }

    transformStateToRequestBody() {
        let games = {}
        for (let [key, value] of Object.entries(this.state)) {
            const [prop, gameNum] = key.split('_');

            let gameNumAdded = Object.keys(games).filter(k => k === gameNum);
            if (gameNumAdded.length === 0) {
                games[gameNum] = {
                    homeTeamGoals: '0',
                    awayTeamGoals: '0'
                }
            }

            if (prop.trim() === 'home') {
                games[gameNum].homeTeamGoals = value
            } else if (prop.trim() === 'away') {
                games[gameNum].awayTeamGoals = value
            } else {
                games[gameNum].gameId = value
            }

            //set sign
            for (let game of Object.values(games)) {
                let homeGoals = Number(game.homeTeamGoals);
                let awayGoals = Number(game.awayTeamGoals);

                if (homeGoals > awayGoals) {
                    game.sign = '1'
                } else if (homeGoals < awayGoals) {
                    game.sign = '2'
                } else {
                    game.sign = 'X'
                }
            }
        }

        return games;
    }

    render() {
        const { fixture } = this.props

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="container col-sm-offset-1 col-sm-10">
                    <br />
                    <h3>Your bets for round {fixture.round}</h3>
                    <hr />
                    {
                        fixture.gameStats.map((g, i) => (<GamePair
                            key={g._id}
                            game={g}
                            gameNum={i + 1}
                            handleChange={this.handleChange}
                        />))
                    }
                    <button className="btn btn-lg btn-outline-success">Save</button>
                </div>
            </form>
        );
    }
}

export default PlaceBetsForm;