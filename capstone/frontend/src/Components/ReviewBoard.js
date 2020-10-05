import React from 'react';
import Rating from 'react-rating';
import ReviewRow from './ReviewRow';
import { StarFill } from 'react-bootstrap-icons';

class ReviewBoard extends React.Component {

    render() {

        const reviews = this.props.reviews;
        const avg_rating = reviews.reduce((total, next) => total + next.rating, 0) / reviews.length;
        const icon_size = 20;

        return (
            <div className="mt-1">
                {
                    reviews.length > 0 &&
                    <div className="mb-1">
                        <span className="h4 text-muted mb-0">{avg_rating.toFixed(1)}</span>
                        <Rating
                            className="mx-2 pt-0 align-top"
                            initialRating={avg_rating}
                            readonly
                            emptySymbol={<StarFill fill="#dee2e6" size={icon_size}/>}
                            fullSymbol={<StarFill fill="orange" size={icon_size}/>}
                        />
                        <span className="h6 text-muted">
                            {`${reviews.length} ${reviews.length===1 ? 'review' : 'reviews'}`}
                        </span>
                    </div>
                }
                {reviews.map(review => (
                    <ReviewRow key={review.id} review={review}/>
                ))}
                {
                    reviews.length===0 &&
                    <p><em>No reviews yet.</em></p>
                }
            </div>
        );
    }
}

export default ReviewBoard;