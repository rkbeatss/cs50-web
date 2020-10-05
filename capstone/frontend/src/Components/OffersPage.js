import React from 'react';
import axios from 'axios';
import NavMenu from './NavMenu';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import ReviewBoard from './ReviewBoard';
import { API_URL } from '../Util/Constants';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import './css/OffersPage.css';
import './css/Index.css';

class OffersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            task: this.props.location.state.task,
            offers: this.props.location.state.offers,
            reviews: [],
            config: {
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('token')}`
                }
            }
        }
        this.getReviews = this.getReviews.bind(this);
    }

    getReviews() {
        const url = `${API_URL}/tasks/${this.state.task.id}/reviews`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(reviews => this.setState({reviews: reviews}))
    }

    componentDidMount() {
        this.getReviews();
    }

    render() {

        const task = this.state.task;
        const offers = this.state.offers;
        const reviews = this.state.reviews;

        return (
            <div>
                <NavMenu />
                <div className="page">
                    <h3 className="mb-0">Review Offers</h3>
                    <h4 className="text-muted">{task.title}</h4>

                    <Carousel activeIndex={this.state.index}
                              interval={null}
                              className="mt-4 carousel"
                              prevIcon={<ArrowLeft className="arrow" size={40} color="black"/>}
                              nextIcon={<ArrowRight className="arrow" size={40} color="black"/>}
                              onSelect={i => this.setState({index: i})}
                    >
                        {offers.map(offer => (
                            <Carousel.Item key={offer.id}>
                                <div className="mx-5 mb-5 h-100">
                                    <h5 className="mb-0">{`${offer.tasker.first_name} ${offer.tasker.last_name}`}</h5>
                                    <h5 className="text-muted">@{offer.tasker.username}</h5>
                                    <p>{offer.message}</p>

                                    <h5>Reviews</h5>
                                    <ReviewBoard reviews={reviews.filter(review => review.task.assignee.id===offer.tasker.id)}/>

                                    <Button 
                                        variant="success"
                                        size="lg"
                                        className="mt-2"
                                        block
                                    >
                                        Accept Offer
                                    </Button>

                                </div>
                            </Carousel.Item>
                        ))}

                    </Carousel>


                </div>
            </div>
        );
    }
}

export default OffersPage;
