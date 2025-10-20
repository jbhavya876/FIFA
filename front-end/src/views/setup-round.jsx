import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import AdminService from '../services/admin-service';
import SetupRoundForm from '../components/RoundSetup/setup-round-form';

class RoundSetup extends Component {
    static AdminService = new AdminService();

    constructor(props) {
        super(props);

        this.state = {
            selectedRound: 0,
            isRoundSelected: false,
            isDataFetched: false,
            teamsDropDownData: [],
            error: ''
        }
    }

    showError = () => {
        const { error } = this.state;
        if (error) {
            toast.error(error);
        }
    }

    getRoundsArray() {
        let arr = [];
        for (let i = 1; i <= 38; i++) {
            arr.push(i);
        }

        return arr;
    }

    async componentWillMount() {
        try {
            let response = await RoundSetup.AdminService.getAllTeams();
            if (!response.success) {
                throw new Error(response.message);
            }

            const teamsData = response.data
                .sort(function (a, b) {
                    return a.name.localeCompare(b.name)
                })
                .map(function (t) {
                    return {
                        name: t.name,
                        id: t._id
                    }
                });

            this.setState({
                teamsDropDownData: teamsData
            })
        } catch (err) {
            this.setState({
                error: err.message
            });
            this.showError();
        }
    }

    handleDropDownChange = (event) => {
        this.setState({
            selectedRound: event.target.value,
            isRoundSelected: true
        })
    }


    render() {
        const { isRoundSelected, selectedRound, teamsDropDownData } = this.state;
       
        if (!isRoundSelected) {
            return (
                <Fragment>
                    <div className="container col-sm-offset-1 col-sm-10">
                        <br />
                        <h3>Please select round</h3>
                        <hr />
                        <div className="col-sm-2 row">
                            <select className="form-control" onChange={this.handleDropDownChange}>
                                {
                                    this.getRoundsArray().map(i => (
                                        <option key={i} value={i}>Round {i}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                </Fragment>
            )
        }

        return (
            <SetupRoundForm
                selectedRound={selectedRound}
                teamsDropDownData={teamsDropDownData}
            />
        );
    }
}

export default RoundSetup;