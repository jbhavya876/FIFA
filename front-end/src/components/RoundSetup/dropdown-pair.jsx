import React, { Component, Fragment } from 'react';
import TeamsDropDown from './teams-dropdown';

class DropDownPair extends Component {

    render() {
        const { gameNum, teamsData, handleChange } = this.props

        return (
            <Fragment>
                <div className="row">

                    <div className="col-sm-1">
                        <h6>Game {gameNum} </h6>
                    </div>

                    <div className="col-sm-3">
                        <TeamsDropDown
                            idProp={`home_${gameNum}`}
                            teamsData={teamsData}
                            handleChange={handleChange}
                        />
                    </div>


                    <div className="col-sm-1 text-center">
                        &nbsp;&nbsp;&nbsp;
                                    <span>VS</span>
                        &nbsp;&nbsp;&nbsp;
                                </div>

                    <div className="col-sm-3">
                        <TeamsDropDown
                            idProp={`away_${gameNum}`}
                            teamsData={teamsData}
                            handleChange={handleChange}
                        />
                    </div>
                </div>
                <hr />
            </Fragment>
        );
    }
}

export default DropDownPair;