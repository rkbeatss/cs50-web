import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import NavMenu from './NavMenu';
import { Redirect } from "react-router-dom";
import { API_URL } from '../Util/Constants';
import './css/Index.css';


class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            validated: false,
            displayError: false,
            username: '',
            password: ''
        }
        this.loginUser = this.loginUser.bind(this);
    }

    loginUser(event) {
        event.preventDefault();

        const url = `${API_URL}/token-auth/`;
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.state.username && this.state.password) {
            axios.post(
                url, {
                username: this.state.username,
                password: this.state.password
            }, {
                headers: headers
            })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                this.setState({loggedIn: true})
                console.log(response);
            })
            .catch(error => {
                this.setState({displayError: true})
                console.log(error);
            });
        } else {
            this.setState({validated: true});
        }

    }

    render() {

        return (
            <div>
                <NavMenu />
                <Form className="page" onSubmit={this.loginUser} noValidate validated={this.state.validated}>
                    <h3>Sign in to Tasker</h3>
                    {
                        this.state.displayError &&
                        <Alert variant='danger'>Invalid username and/or password</Alert>
                    }
                    <Form.Group controlId="loginFormUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                                    value={this.state.username}
                                    autoFocus
                                    autoComplete="off"
                                    required
                                    onChange={e => this.setState({username: e.target.value})}
                        />
                        <Form.Control.Feedback type="invalid">
                            Username is required
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="loginFormPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                                    value={this.state.password}
                                    required
                                    onChange={e => this.setState({password: e.target.value})}
                        />
                        <Form.Control.Feedback type="invalid">
                            Password is required
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">Sign in</Button>
                </Form>
                {this.state.loggedIn && <Redirect to="/tasks" />}
            </div>
        );
    }
}

export default LoginForm;