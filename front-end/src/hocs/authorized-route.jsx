import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserConsumer } from '../components/contexts/user-context';

class AuthorizedRoute extends Component {

    render() {
        const { isLoggedIn } = this.props;

        if (!isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return <Route {...this.props} />
    }
}

const AuthorizedRouteWithContext = (props) => {
    return (
        <UserConsumer>            
            {
                ({ user }) => (
                    <AuthorizedRoute isLoggedIn={user.isLoggedIn} {...props} />
                )
            }
        </UserConsumer>
    )
}

export default AuthorizedRouteWithContext;