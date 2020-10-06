import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavMenu from './NavMenu';
import Carousel from 'react-bootstrap/Carousel';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ReviewBoard from './ReviewBoard';
import ReviewSummary from './ReviewSummary';
import { API_URL } from '../Util/Constants';
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
        this.acceptOffer = this.acceptOffer.bind(this);
    }

    getReviews() {
        const url = `${API_URL}/tasks/${this.state.task.id}/reviews`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(reviews => this.setState({reviews: reviews}))
    }

    acceptOffer(offer) {
        console.log(offer.price);
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
                              interval={5000}
                              className="mt-4 carousel"
                              onSelect={i => this.setState({index: i})}
                    >
                        {offers.map(offer => (
                            <Carousel.Item key={offer.id}>
                                <div className="">

                                    <Link to={`/profile/${offer.tasker.username}`}>
                                        <h4 className="mb-0">{`${offer.tasker.first_name} ${offer.tasker.last_name}`}</h4> 
                                    </Link>
                                    
                                    <h5 className="text-muted">@{offer.tasker.username}</h5>
                                    <ReviewSummary reviews={reviews.filter(review => review.task.assignee.id===offer.tasker.id)} />

                                    <Alert variant="success" className="mt-3 p-3">
                                        <Alert.Heading>
                                            Offer
                                        </Alert.Heading>
                                        <h3>${offer.price}</h3>
                                        <p className="mb-3">{offer.message}</p>

                                        <Button 
                                            variant="success"
                                            size="lg"
                                            className="mb-2"
                                            onClick={() => this.acceptOffer(offer)}
                                        >
                                            Accept Offer
                                        </Button>
                                    </Alert>

                                    <h5 className="mt-4 mb-0">Reviews</h5>
                                    <ReviewBoard reviews={reviews.filter(review => review.task.assignee.id===offer.tasker.id)} summary={false} />

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
