import React from 'react';
import axios from 'axios';
import Rating from 'react-rating';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import TaskBoard from './TaskBoard';
import QuestionsBoard from './QuestionsBoard';
import OffersBoard from './OffersBoard';
import TaskDetails from './TaskDetails';
import NavMenu from './NavMenu';
import Progressbar from './ProgressBar';
import { StarFill } from 'react-bootstrap-icons';
import { API_URL } from '../Util/Constants';
import './css/TasksPage.css';
import './css/Index.css';

class TasksPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            task: null,
            tasks: [],
            questions: [],
            offers: [],
            question: '',
            message: '',
            price: '',
            reviewMessage: '',
            reviewRating: 0,
            offerFormVisible: false,
            reviewFormVisible: false,
            alreadyMadeOffer: false,
            existingOffer: '',
            username: jwt_decode(localStorage.getItem('token')).username,
            config: {
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('token')}`
                }
            }
        }
        this.getQuestions = this.getQuestions.bind(this);
        this.getOffers = this.getOffers.bind(this);
        this.fetchTask = this.fetchTask.bind(this);
        this.getMostRecentTask = this.getMostRecentTask.bind(this);
        this.postQuestion = this.postQuestion.bind(this);
        this.postOffer = this.postOffer.bind(this);
        this.editOffer = this.editOffer.bind(this);
        this.postReview = this.postReview.bind(this);
        this.getAllTasks = this.getAllTasks.bind(this);
        this.markTaskAsComplete = this.markTaskAsComplete.bind(this);
    }

    getQuestions(taskID) {
        const url = `${API_URL}/tasks/${taskID}/questions`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(questions => this.setState({questions: questions}))
    }

    getOffers(taskID) {
        const url = `${API_URL}/tasks/${taskID}/offers`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(offers => {
            const existingOffer = offers.filter(offer => offer.tasker.username===this.state.username)[0];
            this.setState({
                offers: offers,
                existingOffer: existingOffer,
                alreadyMadeOffer: existingOffer ? true : false,
                message: existingOffer ? existingOffer.message : '',
                price: existingOffer ? existingOffer.price : '',
            });
        });
    }

    fetchTask(task) {
        this.setState({
            task: task, 
            offerFormVisible: false, 
            reviewFormVisible: false,
            message: '',
            price: '',
            reviewMessage: '',
            reviewRating: 0
        });
        this.getQuestions(task.id);
        this.getOffers(task.id);
    }

    getMostRecentTask() {
        let url;
        if (this.props.match.params.taskid) {
            url = `${API_URL}/tasks/${this.props.match.params.taskid}`;
        } else {
            url = `${API_URL}/tasks/top`;
        }
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(task => this.fetchTask(task))
    }

    getAllTasks() {
        const url = `${API_URL}/tasks`;
        axios.get(url, this.state.config)
        .then(response => response.data)
        .then(tasks => this.setState({tasks: tasks}));
    }

    componentDidMount() {
        this.getMostRecentTask();
        this.getAllTasks();
    }

    // Post the question by submitting form
    postQuestion(event) {
        event.preventDefault();

        const url = `${API_URL}/questions/`;
        axios.post(url, {
            taskId: this.state.task.id,
            commenter: this.state.username,
            content: this.state.question
        }, this.state.config)
        .then(response => console.log(response))
        .then(() => this.getQuestions(this.state.task.id));
        
        this.setState({question: ''});
    }

    // Post the offer by submitting form
    postOffer(event) {
        event.preventDefault();

        const url = `${API_URL}/offers/`;
        axios.post(url, {
            taskId: this.state.task.id,
            price: this.state.price,
            tasker: this.state.username,
            message: this.state.message
        }, this.state.config)
        .then(response => console.log(response))
        .then(() => this.getOffers(this.state.task.id))
        // Calling this to update offer number on card - must be more efficient way to do this?
        .then(() => this.getAllTasks());

        this.setState({message: '', price: '', offerFormVisible: false});
    }

    editOffer(event) {
        event.preventDefault();

        const url = `${API_URL}/offers/${this.state.existingOffer.id}`;
        axios.put(url, {
            message: this.state.message,
            price: this.state.price
        }, this.state.config)
        .then(response => console.log(response));

        this.setState(prevState => ({
            offerFormVisible: false,
            offers: [
                ...prevState.offers.filter(offer => offer.tasker.username!==this.state.username && offer.timestamp > this.state.existingOffer.timestamp),
                {
                    ...prevState.offers.filter(offer => offer.tasker.username===this.state.username)[0],
                    message: this.state.message,
                    price: this.state.price
                },
                ...prevState.offers.filter(offer => offer.tasker.username!==this.state.username && offer.timestamp <= this.state.existingOffer.timestamp),
            ],
            existingOffer: {
                ...prevState.existingOffer,
                message: this.state.message,
                price: this.state.price
            },
        }));
    }
    
    // Post the review by submitting form
    postReview(event) {
        event.preventDefault();

        const reviewee = this.state.username===this.state.task.poster.username ?
                         this.state.task.assignee.username :
                         this.state.task.poster.username;

        const url = `${API_URL}/reviews/`;
        axios.post(url, {
            taskId: this.state.task.id,
            reviewer: this.state.username,
            reviewee: reviewee,
            rating: this.state.reviewRating,
            content: this.state.reviewMessage
        }, this.state.config)
        .then(response => console.log(response));

        this.setState({reviewMessage: '', reviewRating: 0, reviewFormVisible: false});
    }

    markTaskAsComplete() {
        const url = `${API_URL}/tasks/${this.state.task.id}`;
        axios.put(url, {
            status: 'Completed',
        }, this.state.config)
        .then(response => console.log(response))

        this.setState(prevState => ({
            task: {
                ...prevState.task,
                status: 'Completed'
            },
            tasks: [
                ...prevState.tasks.filter(task => task.id!==this.state.task.id && task.timestamp > this.state.task.timestamp),
                {
                    ...prevState.tasks.filter(task => task.id===this.state.task.id)[0],
                    status: 'Completed'
                },
                ...prevState.tasks.filter(task => task.id!==this.state.task.id && task.timestamp <= this.state.task.timestamp),
            ],
        }));
    }

    render() {

        const task = this.state.task;
        const questions = this.state.questions;
        const offers = this.state.offers;
        const iconSize = 30;

        return (
            <div>
                <NavMenu default={false} />
                <div className="tasksPage page">
                    <h3>Open Tasks</h3>
                    <Container fluid>
                        <Row>
                            <Col sm={4} id="tasksCol" className="pl-0">
                                <TaskBoard tasks={this.state.tasks} fetchtask={this.fetchTask} currentTaskId={task ? task.id : null}/>
                            </Col>

                            <Col sm={8} id="detailsCol">
                                {this.state.task &&
                                    <div>
                                        <Progressbar status={task.status} />

                                        <h4>{task.title}</h4>
                                        <TaskDetails task={task}/>
                                        {
                                            !this.state.offerFormVisible &&
                                            task.poster.username!==this.state.username &&
                                            task.status==='Open' &&
                                            <Button 
                                                variant="success"
                                                size="lg"
                                                className="mt-2"
                                                block
                                                onClick={() => this.setState({offerFormVisible: true})}
                                            >
                                                {
                                                    this.state.alreadyMadeOffer ? 'Edit Offer' : 'Make an Offer'
                                                }
                                            </Button>
                                        }
                                        {
                                            task.poster.username===this.state.username &&
                                            task.status==='Open' &&
                                            offers.length > 0 &&
                                            <Link to={{
                                                pathname: `/offers/${task.id}`,
                                                state: {
                                                    task: task,
                                                    offers: offers
                                                }}} className="text-decoration-none">
                                                <Button 
                                                    variant="primary"
                                                    size="lg"
                                                    className="mt-2"
                                                    block
                                                >
                                                    Review All Offers
                                                </Button>
                                            </Link>
                                        }
                                        {
                                            task.poster.username===this.state.username &&
                                            task.status==='Assigned' &&
                                            <Button 
                                                variant="danger"
                                                size="lg"
                                                className="mt-2"
                                                block
                                                onClick={this.markTaskAsComplete}
                                            >
                                                Mark As Complete
                                            </Button>
                                        }
                                        {
                                            task.poster.username===this.state.username &&
                                            offers.length===0 &&
                                            task.status==='Open' &&
                                            <Button 
                                                variant="primary"
                                                size="lg"
                                                className="mt-2"
                                                disabled={true}
                                                block
                                            >
                                                No Offers to Review Yet
                                            </Button>
                                        }
                                        {
                                            task.status==='Completed' &&
                                            !this.state.reviewFormVisible &&
                                            (this.state.username===task.poster.username ||
                                            this.state.username===task.assignee.username) &&
                                            <Button 
                                                variant="primary"
                                                size="lg"
                                                className="mt-2"
                                                block
                                                onClick={() => this.setState({reviewFormVisible: true})}
                                            >
                                                {`Add a Review for ${this.state.username===task.poster.username ?
                                                task.assignee.first_name :
                                                task.poster.first_name}`}
                                            </Button>
                                        }

                                        {this.state.offerFormVisible && task.poster.username!== this.state.username &&
                                            <Form className="mt-3" onSubmit={this.state.existingOffer ? this.editOffer : this.postOffer}>
                                                <Form.Group controlId="offerFormMessage">
                                                    <Form.Control as="textarea"
                                                                required
                                                                rows="3"
                                                                value={this.state.message}
                                                                placeholder="Message"
                                                                onChange={e => this.setState({message: e.target.value})}
                                                    />
                                                </Form.Group>
                                                <Form.Group>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text>$</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <Form.Control id="offerFormPrice"
                                                                    required
                                                                    type="number"
                                                                    min={0}
                                                                    value={this.state.price}
                                                                    placeholder="Offer Price"
                                                                    onChange={e => this.setState({price: e.target.value})}>
                                                        </Form.Control>
                                                    </InputGroup>
                                                </Form.Group>
                                                <Button variant="primary" 
                                                        type="submit"
                                                        size="sm" 
                                                        disabled={this.state.message==='' || 
                                                                this.state.price==='' || 
                                                                this.state.price < 0 ||
                                                                (this.state.existingOffer && 
                                                                this.state.message===this.state.existingOffer.message && 
                                                                parseInt(this.state.price)===this.state.existingOffer.price)}
                                                >
                                                        {this.state.alreadyMadeOffer ? 'Edit Offer' : 'Submit Offer'}
                                                </Button>
                                                <Button variant="secondary" 
                                                        size="sm" 
                                                        className="ml-2"
                                                        onClick={() => {
                                                            this.setState({
                                                                offerFormVisible: false,
                                                                message: this.state.alreadyMadeOffer ? this.state.existingOffer.message : '',
                                                                price: this.state.alreadyMadeOffer ? this.state.existingOffer.price : ''
                                                            });
                                                        }}
                                                >
                                                        Cancel
                                                </Button>
                                            </Form>
                                        }

                                        {this.state.reviewFormVisible &&
                                            <Form className="mt-3" onSubmit={this.postReview}>
                                                <Rating
                                                    initialRating={this.state.reviewRating}
                                                    className="mb-3"
                                                    emptySymbol={<StarFill size={iconSize} fill="#dee2e6" />}
                                                    fullSymbol={<StarFill size={iconSize} fill="orange" />}
                                                    onChange={value => this.setState({reviewRating: value})}
                                                />
                                                <Form.Group controlId="reviewFormMessage">
                                                    <Form.Control as="textarea"
                                                                required
                                                                rows="3"
                                                                value={this.state.reviewMessage}
                                                                placeholder="Review"
                                                                onChange={e => this.setState({reviewMessage: e.target.value})}
                                                    />
                                                </Form.Group>
                                                <Button variant="primary" 
                                                        type="submit"
                                                        size="sm" 
                                                        disabled={this.state.reviewMessage==='' ||
                                                                this.state.reviewRating===0}
                                                >
                                                        Post Review
                                                </Button>
                                                <Button variant="secondary" 
                                                        size="sm" 
                                                        className="ml-2"
                                                        onClick={() => this.setState({reviewFormVisible: false, reviewMessage: '', reviewRating: 0})}
                                                >
                                                        Cancel
                                                </Button>
                                            </Form>
                                        }


                                        <hr />
                                        <h4>{`Offers (${offers.length})`}</h4>
                                        <OffersBoard offers={offers} 
                                                     assigneeId={task.assignee ? task.assignee.id : null}
                                        />

                                        <hr />
                                        <h4>{`Questions (${questions.length})`}</h4>
                                        {
                                            task.status==='Open' &&
                                            <Form onSubmit={this.postQuestion}>
                                                <Form.Group className="mb-1" controlId="questionsForm">
                                                    <Form.Control as="textarea"
                                                                rows="3"
                                                                value={this.state.question}
                                                                placeholder={
                                                                    task.poster.username===this.state.username ? 
                                                                    'Respond to questions' :
                                                                    `Ask ${task.poster.first_name} a question`
                                                                }
                                                                maxLength={1500}
                                                                onChange={e => this.setState({question: e.target.value})}
                                                    />
                                                </Form.Group>
                                                <Button variant="primary" 
                                                        type="submit" 
                                                        size="sm" 
                                                        disabled={this.state.question===''}
                                                >
                                                    Send
                                                </Button>
                                            </Form>
                                        }

                                        <QuestionsBoard questions={questions}
                                                        posterId={task.poster.id}
                                        />

                                    </div>
                                }
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default TasksPage;