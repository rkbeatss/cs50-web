import React from 'react';
import ReviewRow from './ReviewRow';
import ReviewSummary from './ReviewSummary';

class ReviewBoard extends React.Component {

    render() {

        const reviews = this.props.reviews;

        return (
            <div className="mt-1">
                {
                    this.props.summary &&
                    <ReviewSummary reviews={reviews}/>
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