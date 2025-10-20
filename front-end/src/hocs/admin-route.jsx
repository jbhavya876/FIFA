import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserConsumer } from '../components/contexts/user-context';

class AdminRoute extends Component {

    render() {
        const { isAdmin, isLoggedIn } = this.props;

        if (!isAdmin || !isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return <Route {...this.props} />
    }
}

const AdminRouteRouteWithContext = (props) => {
    return (
        <UserConsumer>            
            {
                ({ user }) => (
                    <AdminRoute 
                    isAdmin={user.isAdmin}
                    isLoggedIn={user.isLoggedIn} 
                    {...props} />
                )
            }
        </UserConsumer>
    )
}

export default AdminRouteRouteWithContext;