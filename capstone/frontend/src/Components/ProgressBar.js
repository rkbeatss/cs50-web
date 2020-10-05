import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

class ProgressBar extends React.Component {

    render() {

        return (

            <Pagination size="sm">
                <Pagination.Item active={true}>Open</Pagination.Item>
                {
                    this.props.status==='Open' &&
                    <Pagination.Item disabled={true}>Assigned</Pagination.Item>
                }
                {
                    this.props.status!=='Open' &&
                    <Pagination.Item active={true}>Assigned</Pagination.Item>
                }
                {
                    this.props.status==='Completed' &&
                    <Pagination.Item active={true}>Completed</Pagination.Item>
                }
                {
                    this.props.status!=='Completed' &&
                    <Pagination.Item disabled={true}>Completed</Pagination.Item>
                }
            </Pagination>

        );
    }
}

export default ProgressBar;