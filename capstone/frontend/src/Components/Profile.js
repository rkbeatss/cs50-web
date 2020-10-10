import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import NavMenu from './NavMenu';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { API_URL } from '../Util/Constants';
import ReviewBoard from './ReviewBoard';
import ProfileDetails from './ProfileDetails';
import './css/Profile.css';
import './css/Index.css';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            reviews: [],
            key: 'tasker',
            showEditAboutForm: false,
            about: '',
            config: {
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('token')}`
                }
            }
        }
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.saveAbout = this.saveAbout.bind(this);
    }

    getUserInfo() {
        const url = `${API_URL}/profile/${this.props.match.params.username}`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(user => this.setState({user: user, about: user.about}))
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

    saveAbout(event) {
        event.preventDefault();

        const url = `${API_URL}/profile/${this.state.user.username}`;
        axios.put(url, {
            about: this.state.about,
        }, this.state.config)
        .then(response => console.log(response));

        this.setState({showEditAboutForm: false});
    }

    render() {

        const user = this.state.user;
        const reviews = this.state.reviews;
        const reviews_as_poster = reviews.filter(review => review.task.poster.username===user.username);
        const reviews_as_tasker = reviews.filter(review => review.task.assignee && review.task.assignee.username===user.username);

        return (
            <div>
                <NavMenu />
                {user &&
                <div className="page">
                    <ProfileDetails user={user} />

                    <h4 className="mt-4 d-flex align-items-center">
                        About
                        {
                            this.props.match.params.username===jwt_decode(localStorage.getItem('token')).username &&
                            !this.state.showEditAboutForm &&
                            <Button size="sm"
                                    className="ml-2"
                                    variant="primary"
                                    onClick={() => this.setState({showEditAboutForm: true})}
                            >
                                Edit
                            </Button>
                        }
                    </h4>

                    {
                        !this.state.showEditAboutForm &&
                        <div>
                            {
                                this.state.about!=='' &&
                                <p>{this.state.about}</p>
                            }
                            {
                                this.state.about==='' &&
                                <p><em>No description provided yet.</em></p>
                            }
                        </div>
                    }

                    {
                        this.state.showEditAboutForm &&
                        <Form onSubmit={this.saveAbout}>
                            <Form.Group controlId="userAboutForm" className="mb-2">
                                <Form.Control as="textarea"
                                              maxLength={500}
                                              rows="4"
                                              value={this.state.about}
                                              onChange={e => this.setState({about: e.target.value})}
                                />
                            </Form.Group>
                            <Button variant="primary" 
                                    type="submit"
                                    size="sm" 
                            >
                                    Save
                            </Button>
                            <Button variant="outline-secondary"
                                    size="sm" 
                                    className="ml-2"
                                    onClick={() => this.setState({showEditAboutForm: false, about: user.about})}
                            >
                                    Cancel
                            </Button>
                        </Form>
                    }

                    <h4 className="mt-4">Reviews</h4>

                    <Tabs id="reviewsTab"
                          activeKey={this.state.key}
                          transition={false}
                          onSelect={k => this.setState({key: k})}
                    >
                        <Tab eventKey="tasker" title={`As Tasker (${reviews_as_tasker.length})`}>
                            <ReviewBoard reviews={reviews_as_tasker} summary={true} />
                        </Tab>

                        <Tab eventKey="poster" title={`As Poster (${reviews_as_poster.length})`}>
                            <ReviewBoard reviews={reviews_as_poster} summary={true} />
                        </Tab>
                    </Tabs>

                </div>
                }
            </div>
        );
    }
}

export default Profile;
