import React from 'react';
import ReviewRow from './ReviewRow';

class ReviewBoard extends React.Component {

    render() {

        return (
            <div>
                {this.props.reviews.map(review => (
                    <ReviewRow key={review.id} review={review}/>
                ))}
            </div>
        );
    }
}

export default ReviewBoard;