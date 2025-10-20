import React, { Component, Fragment } from 'react';

const ClubLogos = require.context('../../static/images/club-logos', true);

class GamePair extends Component {
    constructor(props) {
        super(props);

        this.setState({
            game: null
        })
    }

    componentWillMount() {
        const { game, gameNum, handleChange } = this.props;

        this.setState({
            game: game,
            homeGoals: game.homeTeamGoals,
            awayGoals: game.awayTeamGoals,
            gameNum: gameNum,
            handleChange: handleChange
        })
    }

    getTeamLogoUrl = (teamName) => {
        return ClubLogos(`./${teamName}.svg`)
    }

    handleGoalsChange = (e, homeOrAway) => {
        if (homeOrAway === 'home') {
            this.setState({
                homeGoals: e.target.value
            })
        } else {
            this.setState({
                awayGoals: e.target.value
            })
        }
    }

    render() {
        const { game, gameNum, handleChange } = this.state;
        const homeTeam = game.homeTeamId;
        const awayTeam = game.awayTeamId;
        //const homeGoals = game.homeTeamGoals;
        const homeGoals = this.state.homeGoals;
        const awayGoals = this.state.awayGoals;


        if (game) {
            return (
                <Fragment>
                    <div className="container-fluid">
                        <div className="row">
                            {/* HOME TEAM SECTION */}
                            <div className="row col-sm-5">
                                <img src={this.getTeamLogoUrl(homeTeam.shortName)} alt="" />
                                &nbsp;&nbsp;
                                <h5>{homeTeam.name}</h5>
                                &nbsp;
                                <div className="ml-auto">
                                    <input
                                        className="form-control"
                                        onChange={(e) => {
                                            this.handleGoalsChange(e, 'home');
                                            handleChange(e, game._id);
                                        }}
                                        id={`home_${gameNum}`}
                                        type="number"
                                        value={homeGoals}
                                        min="0"
                                        max="9"
                                        step="1"
                                        required
                                    />
                                </div>
                            </div>

                            {/* VS SECTION */}
                            <div className="col-sm-1 text-center">
                                {/* &nbsp;&nbsp;&nbsp; */}
                                <h4 className="text-center">VS</h4>
                                {/* &nbsp;&nbsp;&nbsp; */}
                            </div>

                            {/* AWAY TEAM SECTION */}
                            <div className="row col-sm-5">
                                <div className="mr-auto">
                                    <input
                                        className="form-control"
                                        onChange={(e) => {
                                            this.handleGoalsChange(e, 'away');
                                            handleChange(e, game._id);
                                        }}
                                        id={`away_${gameNum}`}
                                        value={awayGoals}
                                        type="number"
                                        min="0"
                                        max="9"
                                        step="1"
                                        required
                                    />
                                </div>

                                <div className="row ml-auto">
                                    &nbsp;
                                <h5>{awayTeam.name}</h5>
                                    &nbsp;&nbsp;
                                <img src={this.getTeamLogoUrl(awayTeam.shortName)} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                </Fragment >
            );
        }
    }
}

export default GamePair;