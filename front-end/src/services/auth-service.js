import { post } from '../data/crud';
 
class AuthService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/auth';
        this.loginUrl = `${this.baseUrl}/login`;
        this.registerUrl = `${this.baseUrl}/signup`;
    }

    login(credentials) {
        return post(this.loginUrl, credentials)
    }

    register(body) {
        return post(this.registerUrl, body)
    }
}

export default AuthService;