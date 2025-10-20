import React, { Component } from 'react';
import { toast } from 'react-toastify';
import BetsService from '../services/bets-service';
import PlaceBetsForm from '../components/PlaceBets/place-bets-form';
import Loading from '../components/common/loading';


const ErrorMessagesToRender = [
    'There is no active round currently, please come back again later!',
    'Sorry, we are no longer accepting bets for this round!'
]

class PlaceBets extends Component {
    static BetsService = new BetsService();

    constructor(props) {
        super(props);

        this.state = {
            fixture: null,
            isDataFetched: false,
            shouldRenderError: false,
            hasError: false,
            error: ''
        }
    }

    showError = () => {
        const {error} = this.state;        
        if(error) {
            toast.error(error);            
        }
    }

    async componentWillMount() {      

        try {
            let response = await PlaceBets.BetsService.getActiveRound();

            if (ErrorMessagesToRender.includes(response.message)) {
                this.setState({
                    hasError: true,
                    shouldRenderError: true,
                    error: response.message,
                    isDataFetched: true
                })
                return;
            }

            if (!response.success) {
                throw new Error(response.message);
            }

            //Demo purposes only
            setTimeout(() => {                
                this.setState({
                    fixture: response.data,
                    isDataFetched: true
                })
            }, 700);            
            
        } catch (err) {
            this.setState({
                hasError: true,
                shouldRenderError: false,
                error: err.message
            });
            this.showError();
        }
    }

    render() {
        const { isDataFetched, fixture, hasError, error } = this.state

        if (!isDataFetched) {
            return (
                <Loading />
            );
        }

        if (hasError) {
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
            <PlaceBetsForm
                fixture={fixture}
            />
        );
    }
}

export default PlaceBets;