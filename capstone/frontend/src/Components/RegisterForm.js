import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import NavMenu from './NavMenu';
import { Redirect } from "react-router-dom";
import { API_URL } from '../Util/Constants';
import './css/CustomForm.css';


class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            validated: false,
            confirmPasswordClassName: 'not-validated',
            displayPasswordError: false,
            displayUsernameError: false,
            username: '',
            password: '',
            confirmPassword: ''
        }
        this.validatePassword = this.validatePassword.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }

    validatePassword() {
        if (!this.state.confirmPassword || this.state.password !== this.state.confirmPassword) {
            this.setState({confirmPasswordClassName: 'non-valid'});
        } else {
            this.setState({confirmPasswordClassName: 'valid'});
        }
    }

    validateForm() {
        this.validatePassword();
        if (this.state.username &&
            this.state.password &&
            this.state.password === this.state.confirmPassword) {
                return true;
            } else {
                return false;
            }
    }

    registerUser(event) {
        event.preventDefault();

        const url = `${API_URL}/token-auth/`;
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.validateForm()) {
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
            // this.setState({displayPasswordError: true})
            this.setState({validated: true})
        }

    }

    render() {

        return (
            <div>
                <NavMenu />
                <Form className="m-3" onSubmit={this.registerUser} noValidate validated={this.state.validated}>
                    <h3>Register New User</h3>
                    {
                        this.state.displayPasswordError &&
                        <Alert variant='danger'>Passwords do not match</Alert>
                    }
                    <Form.Group controlId="registerFormUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                                    value={this.state.username}
                                    required
                                    autoFocus
                                    autoComplete="off"
                                    onChange={e => this.setState({username: e.target.value})}
                        />
                        <Form.Control.Feedback type="invalid">
                            Username is required
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="registerFormPassword">
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

                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password"
                                    value={this.state.confirmPassword}
                                    required
                                    // id="registerFormConfirmPassword"
                                    className={`customFormInput ${this.state.validated ? this.state.confirmPasswordClassName : 'not-validated'}`}
                                    onChange={e => this.setState({confirmPassword: e.target.value}, () => this.validatePassword())}
                        />
                        <p className={`customFormMsg ${this.state.validated && this.state.confirmPasswordClassName==='non-valid' ? 'd-block': 'd-none'}`}>
                            Passwords do not match
                        </p>
                    </Form.Group>

                    <Button variant="success" type="submit">Sign up</Button>
                </Form>
                {this.state.loggedIn && <Redirect to="/tasks" />}
            </div>
        );
    }
}

export default RegisterForm;