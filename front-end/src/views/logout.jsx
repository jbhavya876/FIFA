import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { UserConsumer } from '../components/contexts/user-context';

class Logout extends Component {

    constructor(props) {
        super(props);

        const {updateUser} = this.props;
        
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('auth_token');
        
        updateUser({});
    }

    render() {
        return <Redirect to='/' />
    }
}

const LogoutWithContext = (props) => {
    return (        
        <UserConsumer>
            {
                ({updateUser}) => (
                    <Logout
                        updateUser={updateUser}
                    />
                )
            }
        </UserConsumer>
    );
}

export default LogoutWithContext;