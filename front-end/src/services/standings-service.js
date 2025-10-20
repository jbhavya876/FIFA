import { get } from "../data/crud";

class StandingsService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/standings';
        this.clubStandingsUrl = `${this.baseUrl}/club`;
        this.useerStandingsUrl = `${this.baseUrl}/user`;
    }

    getClubStandings() {
        return get(this.clubStandingsUrl, {}, {})
    }

    getUserStandings() {
        return get(this.useerStandingsUrl, {}, {})
    }
}

export default StandingsService;