import React, { Component } from 'react';
import { toast } from 'react-toastify';
import StandingsService from '../services/standings-service';
import Loading from '../components/common/loading';


//const logos = require.context('../static/images', true);

class ClubStandings extends Component {
    static standingsService = new StandingsService();

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            isDataFetched: false,
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
            let response = await ClubStandings.standingsService.getClubStandings();
            if (!response.success) {
                throw new Error(response.message);
            }

            this.processResponse(response);

        } catch (err) {
            this.setState({
                error: err.message
            })

            this.showError();
        }
    }

    processResponse(response) {
        let sortedStats = [];

        for (let teamStat of response.data) {
            sortedStats.push({
                name: teamStat.team.name,
                shortName: teamStat.team.shortName,
                //imageUrl: logos(`./${teamStat.team.shortName}.svg`),
                //imageUrl: `static/images/${teamStat.team.name}.svg`,
                gamesPlayed: teamStat.gamesPlayed,
                wins: teamStat.wins,
                draws: teamStat.draws,
                losses: teamStat.losses,
                goalsScored: teamStat.goalsScored,
                goalsConceded: teamStat.goalsConceded,
                goalDifference: teamStat.goalsScored - teamStat.goalsConceded,
                points: teamStat.points,
            })
        }

        sortedStats = sortedStats.sort(function (a, b) {
            var pointsSort = b.points - a.points;
            if (pointsSort !== 0) {
                return pointsSort
            }

            return b.goalDifference - a.goalDifference;
        })

        this.setState({
            isDataFetched: true,
            data: sortedStats
        })
    }


    render() {
        const { isDataFetched, data } = this.state;
        let rank = 1;

        if (!isDataFetched) {
            return <Loading />;
        }

        return (
            <div className="container col-sm-offset-1 col-sm-10">
                {/* EPL Standings */}
                <br />
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            {/* <th></th> */}
                            <th>Team</th>
                            <th>P</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>GS</th>
                            <th>GC</th>
                            <th>GD</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(team => (
                            <tr key={team.name}>
                                <td>{rank++}</td>
                                {/* <td>
                                    <img src={team.imageUrl} alt="" height="50%"/>                                        
                                </td> */}
                                <td>{team.name}</td>
                                <td>{team.gamesPlayed}</td>
                                <td>{team.wins}</td>
                                <td>{team.draws}</td>
                                <td>{team.losses}</td>
                                <td>{team.goalsScored}</td>
                                <td>{team.goalsConceded}</td>
                                <td>{team.goalDifference}</td>
                                <td>{team.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ClubStandings;