import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import TaskForm from './TaskForm';
import TasksPage from './TasksPage';
import Profile from './Profile';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

class AppRouter extends React.Component {

    render() {

        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={LoginForm} />
                    <Route exact path="/register" component={RegisterForm} />
                    <Route path="/post-task" component={TaskForm} />
                    <Route path="/tasks" component={TasksPage} />
                    <Route path="/profile/:username" component={Profile} />
                </Switch>
            </Router>
        );
    }
}

export default AppRouter ;