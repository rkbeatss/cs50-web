import React from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TaskBoard from './TaskBoard';
import QuestionsBoard from './QuestionsBoard';
import OffersBoard from './OffersBoard';
import TaskDetails from './TaskDetails';
import './css/TasksPage.css';
import { API_URL } from '../Util/Constants';


class TasksPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            task: null,
            questions: [],
            offers: [],
            offers: [],
            question: ''
        }
        this.getQuestions = this.getQuestions.bind(this);
        this.getOffers = this.getOffers.bind(this);
        this.fetchTask = this.fetchTask.bind(this);
        this.getMostRecentTask = this.getMostRecentTask.bind(this);
        this.postQuestion = this.postQuestion.bind(this);
    }

    getQuestions(taskID) {
        const url = `${API_URL}/tasks/${taskID}/questions`;
        axios.get(url)
        .then(response => response.data)
        .then(questions => this.setState({questions: questions}))
    }

    getOffers(taskID) {
        const url = `${API_URL}/tasks/${taskID}/offers`;
        axios.get(url)
        .then(response => response.data)
        .then(offers => this.setState({offers: offers}))
    }

    fetchTask(task) {
        this.setState({task: task});
        this.getQuestions(task.id);
        this.getOffers(task.id);
    }

    getMostRecentTask() {
        const url = `${API_URL}/tasks/top`;
        axios.get(url)
        .then(response => response.data)
        .then(task => this.fetchTask(task))
    }

    componentDidMount() {
        this.getMostRecentTask();
    }

    // Post the question by submitting form
    postQuestion(event) {
        event.preventDefault();

        const url = `${API_URL}/questions/`;
        axios.post(url, {
            taskId: this.state.task.id,
            commenter: 's_naomi',
            content: this.state.question
        })
        .then(response => console.log(response))
        .then(() => this.getQuestions(this.state.task.id));

        this.setState({question: ''});
    }

    render() {

        const task = this.state.task;
        const questions = this.state.questions;
        const offers = this.state.offers; 

        return (
            <div className="m-3 tasksPage">
                <h3>Open Tasks</h3>
                <Container fluid>
                    <Row>
                        <Col sm={4} id="tasksCol" className="pl-0">
                            <TaskBoard fetchtask={this.fetchTask} currentTaskId={task ? task.id : null}/>
                        </Col>

                        <Col sm={8} id="detailsCol">
                            {this.state.task &&
                                <div>
                                    <h4>{task.title}</h4>
                                    <TaskDetails task={task}/>
                                    <Button 
                                        variant="success"
                                        size="lg"
                                        className="mt-2 w-100"
                                    >
                                        Make an Offer
                                    </Button>

                                    <hr />
                                    <h4>{`Offers (${offers.length})`}</h4>
                                    <OffersBoard offers={offers} />

                                    <hr />
                                    <h4>{`Questions (${questions.length})`}</h4>
                                    <Form onSubmit={this.postQuestion}>
                                        <Form.Group className="mb-1" controlId="questionsForm">
                                            <Form.Control as="textarea"
                                                          rows="3"
                                                          value={this.state.question}
                                                          placeholder={`Ask ${task.poster.first_name} a question`}
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

                                    <QuestionsBoard questions={questions}
                                                    posterId={task.poster.id}
                                    />

                                </div>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default TasksPage;