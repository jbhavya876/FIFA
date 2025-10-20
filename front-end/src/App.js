import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Header from './components/header';
import Home from './views/home';
import NotFound from './views/not-found';
import Login from './views/login';
import Register from './views/register'
import Logout from './views/logout';
import { UserProvider, defaultUserState } from './components/contexts/user-context';
import AuthorizedRoute from './hocs/authorized-route';
import AdminRoute from './hocs/admin-route';
import ClubStandings from './views/club-standings';
import BetStandings from './views/bet-standings';
import RoundSetup from './views/setup-round';
import CompleteRound from './views/complete-round';
import PlaceBetsView from './views/place-bets';

class App extends Component {

  constructor(props) {
    super(props);

    const userFromStorage = window.localStorage.getItem('user');
    const parsedUser = userFromStorage
      ? JSON.parse(userFromStorage)
      : {}

    this.state = {
      user: {
        ...defaultUserState,
        ...parsedUser        
      },
      updateUser: this.updateUser
    }
  }

  updateUser = (user) => {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <div>
        <Router>
          <Fragment>
            <UserProvider value={this.state}>
              <Header />
              <Switch>
                <Route exact path="/" component={Home} /> 
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/standings/premier-league" component={ClubStandings} />
                <Route exact path="/standings/betting" component={BetStandings} />
                <AuthorizedRoute exact path="/bet" component={PlaceBetsView} />
                <AdminRoute exact path="/admin/setup-round" component={RoundSetup} />
                <AdminRoute exact path="/admin/complete-round" component={CompleteRound} />
                <Route component={NotFound} />
              </Switch>
            </UserProvider>
          </Fragment>
        </Router>
        <ToastContainer />
      </div>
    );
  }
}

export default App;