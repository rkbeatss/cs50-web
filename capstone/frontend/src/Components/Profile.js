import React from 'react';
import axios from 'axios';
import NavMenu from './NavMenu';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Calendar3, CheckSquare, Sticky } from 'react-bootstrap-icons';
import { API_URL } from '../Util/Constants';
import ReviewBoard from './ReviewBoard';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            reviews: [],
            key: 'tasker',
            config: {
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('token')}`
                }
            }
        }
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getReviews = this.getReviews.bind(this);
    }

    getUserInfo() {
        const url = `${API_URL}/profile/${this.props.match.params.username}`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(user => this.setState({user: user}))
    }

    getReviews() {
        const url = `${API_URL}/users/${this.props.match.params.username}/reviews`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(reviews => this.setState({reviews: reviews}))
    }

    componentDidMount() {
        this.getUserInfo();
        this.getReviews();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.username !== prevProps.match.params.username) {
            this.getUserInfo();
            this.getReviews();
        }
    }

    render() {

        const user = this.state.user;
        const reviews = this.state.reviews;
        const reviews_as_poster = reviews.filter(review => review.task.poster.username===user.username);
        const reviews_as_tasker = reviews.filter(review => review.task.assignee && review.task.assignee.username===user.username);
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
                    
                    <p className="text-muted mb-1">
                        <Calendar3 size={iconSize} className="mr-2" />
                        {`Member since ${new Date(user.date_joined).toLocaleDateString('en-AU', options)}`}
                    </p>
                    <p className="text-muted mb-1">
                        <Sticky size={iconSize} className="mr-2" />
                        {`${user.num_tasks_posted} ${user.num_tasks_posted === 1 ? 'task' : 'tasks'} posted`}
                    </p>
                    <p className="text-muted mb-1">
                        <CheckSquare size={iconSize} className="mr-2" />
                        {`${user.num_tasks_completed} ${user.num_tasks_completed === 1 ? 'task' : 'tasks'} completed`}
                    </p>

                    <h4 className="mt-4">About</h4>
                    {
                        user.about!=='' &&
                        <p>{user.about}</p>
                    }
                    {
                        user.about==='' &&
                        <p><em>No description provided yet.</em></p>
                    }

                    <h4>Reviews</h4>

                    <Tabs id="reviewsTab"
                          activeKey={this.state.key}
                          transition={false}
                          onSelect={k => this.setState({key: k})}
                    >
                        <Tab eventKey="tasker" title="As Tasker">
                            <ReviewBoard reviews={reviews_as_tasker}/>
                        </Tab>

                        <Tab eventKey="poster" title="As Poster">
                            <ReviewBoard reviews={reviews_as_poster}/>
                        </Tab>
                    </Tabs>

                </div>
                }
            </div>
        );
    }
}

export default Profile;
