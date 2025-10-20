import React, { Component } from 'react';
import { toast } from 'react-toastify';
import AdminService from '../services/admin-service';
import CompleteRoundForm from '../components/CompleteRound/complete-round-form';
import Loading from '../components/common/loading';

const ErrorMessagesToRender = [
    'There are no active rounds, please set up a new round!',
    'More than one active round, please contact your db admin!'
]

class CompleteRound extends Component {
    static AdminService = new AdminService();

    constructor(props) {
        super(props)

        this.state = {
            fixture: null,
            isDataFetched: false,
            renderError: false,
            hasError: false,
            error: ''
        }
    }

    showError = () => {
        const { error } = this.state;
        if (error) {
            toast.error(error);
        }
    }

    async componentWillMount() {
        try {
            let response = await CompleteRound.AdminService.getActiveRound();

            if (ErrorMessagesToRender.includes(response.message)) {
                this.setState({
                    hasError: true,
                    renderError: true,
                    error: response.message,
                    isDataFetched: true
                });
                return;
            }

            if (!response.success) {
                throw new Error(response.message);
            }

            this.setState({
                fixture: response.data,
                isDataFetched: true
            })
        } catch (err) {
            this.setState({
                hasError: true,
                error: err.message
            });
            this.showError();
        }
    }

    render() {
        const { isDataFetched, fixture, renderError, error } = this.state;
       
        if (!isDataFetched) {
            return <Loading />;
        }

        if (renderError) {
            return (
                <div className="container">
                    <div className="col-sm-offset-1 col-sm-10">
                        <br/>
                        <h3>{error}</h3>
                    </div>
                </div>
            );
        }

        return (
            <CompleteRoundForm
                fixture={fixture}
            />
        )
    }
}

export default CompleteRound;