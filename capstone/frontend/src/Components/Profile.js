import React from 'react';
import NavMenu from './NavMenu';

class Profile extends React.Component {

    render() {

        return (
            <div>
                <NavMenu />
                <div className="m-3">
                    <h3>Profile</h3>
                    <h1>{this.props.match.params.username}</h1>
                </div>
            </div>
        );
    }
}

export default Profile;
