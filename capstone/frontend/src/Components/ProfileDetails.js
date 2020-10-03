import React from 'react';
import { Calendar3, CheckSquare, Sticky } from 'react-bootstrap-icons';

class ProfileDetails extends React.Component {

    render() {

        const user = this.props.user;
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const iconSize = 20;

        return (
            <div>
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

            </div>
        );
    }
}

export default ProfileDetails;
