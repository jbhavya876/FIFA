import { get, post } from '../data/crud';
 
class BetsService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/bets';
        this.getActiveRoundUrl = `${this.baseUrl}/get-active-round`;
        this.submitBetsUrl = `${this.baseUrl}/submit`;
    }

    getActiveRound() {
        return get(this.getActiveRoundUrl, {}, {})
    }

    submitBets(body) {
        return post(this.submitBetsUrl, body, {})
    }
}

export default BetsService;