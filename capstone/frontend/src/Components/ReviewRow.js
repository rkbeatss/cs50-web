import React from 'react';
import Rating from 'react-rating';
import timeDiff from '../Util/Functions';
import { Link } from 'react-router-dom';
import { StarFill } from 'react-bootstrap-icons';


class ReviewRow extends React.Component {

    render() {

        const review = this.props.review;
        const reviewAge = timeDiff(new Date(review.timestamp), new Date());

        return (
            <div>
                <Rating
                    initialRating={review.rating}
                    readonly
                    emptySymbol={<StarFill fill="#dee2e6" />}
                    fullSymbol={<StarFill fill="orange" />}
                />
                <p className="mb-0"><small className="text-muted m-0">{reviewAge} ago</small></p>
                <Link to={`/tasks/${review.task.id}`}>
                    <h6 className="mb-0">{review.task.title}</h6>
                </Link>
                <p>
                    <Link to={`/profile/${review.reviewer.username}`}>
                        <span>{`${review.reviewer.first_name} ${review.reviewer.last_name.substring(0, 1)}. `}</span>
                    </Link>
                    <span>{`said "${review.content}"`}</span>
                </p>
            </div>
        );
    }
}

export default ReviewRow;