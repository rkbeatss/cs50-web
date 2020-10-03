import React from 'react';
import axios from 'axios';
import NavMenu from './NavMenu';
import { Calendar3, CheckSquare, Sticky } from 'react-bootstrap-icons';
import { API_URL } from '../Util/Constants';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            config: {
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('token')}`
                }
            }
        }
        // this.getQuestions = this.getQuestions.bind(this);
    }

    componentDidMount() {
        const url = `${API_URL}/profile/${this.props.match.params.username}`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(user => this.setState({user: user}))
    }

    render() {

        const user = this.state.user;
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const iconSize = 20;

        return (
            <div>
                <NavMenu />
                {user &&
                <div className="m-3">
                    <h3 className="mb-0">
                        {`${user.first_name} ${user.last_name}`}
                    </h3>
                    <h5 className="text-muted">@{user.username}</h5>
                    
                    <h6 className="text-muted">
                        <Calendar3 size={iconSize}/>
                        {` Member since ${new Date(user.date_joined).toLocaleDateString('en-AU', options)}`}
                    </h6>
                    <h6 className="text-muted">
                        <Sticky size={iconSize} />
                        {` ${user.num_tasks_posted} ${user.num_tasks_posted === 1 ? 'task' : 'tasks'} posted`}
                    </h6>
                    <h6 className="text-muted">
                        <CheckSquare size={iconSize} />
                        {` ${user.num_tasks_completed} ${user.num_tasks_completed === 1 ? 'task' : 'tasks'} completed`}
                    </h6>

                    <h4 className="mt-4">About</h4>
                    {
                        user.about!=='' &&
                        <p>{user.about}</p>
                    }
                    {
                        user.about==='' &&
                        <p><em>No description provided yet.</em></p>
                    }

                    <hr />
                    <h4>Reviews</h4>
                </div>
                }
            </div>
        );
    }
}

export default Profile;
