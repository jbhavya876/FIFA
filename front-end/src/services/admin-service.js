import { get, post } from "../data/crud";

class AdminService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/admin';
        this.allTeamsUrl = `${this.baseUrl}/all-teams`;
        this.saveRoundUrl = `${this.baseUrl}/save-round`;
        this.getActiveRoundUrl = `${this.baseUrl}/get-active-round`;
        this.completeRoundUrl = `${this.baseUrl}/complete-round`;
    }

    getAllTeams() {
        return get(this.allTeamsUrl, {}, {})
    }

    saveRoundData(body) {
        return post(this.saveRoundUrl, body)
    }

    getActiveRound() {
        return get(this.getActiveRoundUrl, {}, {})
    }

    completeRound(body) {
        return post(this.completeRoundUrl, body)
    }
}

export default AdminService;