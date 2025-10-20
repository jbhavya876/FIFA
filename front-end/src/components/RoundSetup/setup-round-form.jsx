import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import AdminService from '../../services/admin-service';
import DropDownPair from './dropdown-pair';

class SetupRoundForm extends Component {
    static AdminService = new AdminService();

    constructor(props) {
        super(props);

        this.state = {
            betsAcceptedBy: '',
            home_1: '', away_1: '',
            home_2: '', away_2: '',
            home_3: '', away_3: '',
            home_4: '', away_4: '',
            home_5: '', away_5: '',
            home_6: '', away_6: '',
            home_7: '', away_7: '',
            home_8: '', away_8: '',
            home_9: '', away_9: '',
            home_10: '', away_10: '',
        }
    }

    showError = (error) => {
        toast.error(error);
    }

    showSuccess = (message) => {
        toast.success(message);
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        // const values = Object.values(this.state);
        // if(values.filter(v => v === '').length) {
        //     this.showError('All fields are required');
        //     return;
        // }

        // const uniqueValues = [...new Set(values)]
        // if(uniqueValues.length !== values.length) {
        //     this.showError('The same team cannot be selected for more than one game');
        //     return; 
        // }

        const { betsAcceptedBy, ...rest } = this.state;

        const reqBody = {
            betsAcceptedBy: this.state.betsAcceptedBy,
            round: this.props.selectedRound,
            games: this.transformStateToReqBody(rest)
        }

        try {
            let response = await SetupRoundForm.AdminService.saveRoundData(reqBody);
        
            if (!response.success) {
                throw new Error(response.message);
            }

            this.showSuccess(response.message);
        } catch (err) {
            this.showError(err.message)
        }
    }

    transformStateToReqBody(state) {
        let reqBody = {}
        for (let [key, value] of Object.entries(state)) {
            const [homeOrAway, gameNum] = key.split('_');

            let gameNumAdded = Object.keys(reqBody).filter(k => k === gameNum);
            if (gameNumAdded.length === 0) {
                reqBody[gameNum] = {
                    home_team_id: 'X',
                    away_team_id: 'X'
                }
            }

            if (homeOrAway.trim() === 'home') {
                reqBody[gameNum].home_team_id = value
            } else {
                reqBody[gameNum].away_team_id = value
            }
        }

        return reqBody;
    }

    getGameNumbersArray() {
        let arr = [];

        for (let i = 1; i <= 10; i++) {
            arr.push(i);
        }

        return arr;
    }

    render() {
        const { selectedRound, teamsDropDownData } = this.props;

        return (
            <Fragment>
                <form onSubmit={this.handleSubmit}>
                    <div className="container col-sm-offset-1 col-sm-10">
                        <br />
                        <h3>Setup Games for Round {selectedRound}</h3>
                        <hr />

                        {
                            this.getGameNumbersArray().map(i =>
                                <DropDownPair
                                    key={i}
                                    gameNum={i}
                                    teamsData={teamsDropDownData}
                                    handleChange={this.handleChange}
                                />
                            )
                        }

                        <div className="row">
                            <div className="col-sm-2">
                                <h6 className="control-label">Bets Accepted By</h6>
                            </div>
                            <div className="col-sm-3">
                            <input
                                required
                                className="form-control"
                                id="betsAcceptedBy"
                                type="date"
                                onChange={this.handleChange}
                            />
                            </div>                            
                        </div>
                        <br/>
                        <button className="btn btn-outline-success" type="submit">Submit</button>
                    </div>
                </form>
                <br />
            </Fragment>
        );
    }
}

export default SetupRoundForm;