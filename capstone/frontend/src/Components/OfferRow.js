import React from 'react';
import { Link } from 'react-router-dom';
import timeDiff from '../Util/Functions';
import Badge from 'react-bootstrap/Badge';

class OfferRow extends React.Component {

    render() {

        const offer = this.props.offer;
        const offerAge = timeDiff(new Date(offer.timestamp), new Date());

        return (
            <div>
                <h6 className="text-primary mb-0 mt-3">
                    <Link to={`/profile/${offer.tasker.username}`}>
                        {`${offer.tasker.first_name} 
                        ${offer.tasker.last_name}`}
                        <span className="text-muted">{` @${offer.tasker.username}`} </span>
                    </Link>
                    {this.props.assigneeId===offer.tasker.id &&
                    <Badge pill variant="primary">Tasker</Badge>}
                </h6>
                <p className="m-0">{offer.message}</p>
                <small className="text-muted m-0">{offerAge} ago</small>
            </div>
        );
    }
}

export default OfferRow;