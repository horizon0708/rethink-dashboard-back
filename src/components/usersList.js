"use strict"
import { Table, Button, Well, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import UserItem from './userItem';
import { generatePeople, postPerson } from './userGenerator';
import io from 'socket.io-client';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

var socket = io('http://localhost:3002/');
class UsersList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSort: 'joindate',
            orderBy: 'asc'
        }

        socket.on('new_user', (data) => {
            console.log('renew?');
            console.log(data);
            let sort = `${this.state.currentSort}_${this.state.orderBy}`;
            this.props.getAllUsers(sort);
        })
    }

    handleHeadClick(rowname) {
        this.setState({ orderBy: this.state.orderBy === 'asc' ? 'desc' : 'asc' }, () => {
            this.setState({ currentSort: rowname }, () => {
                let sort = `${this.state.currentSort}_${this.state.orderBy}`;
                this.props.getAllUsers(sort);
            })
        })
    }


    renderCaret(rowname) {
        if (this.state.currentSort !== rowname) {
            return null;
        }
        return this.state.orderBy === 'asc' ? <i className="fa fa-caret-up" aria-hidden="true"></i> : <i className="fa fa-caret-down" aria-hidden="true"></i>
    }

    componentDidMount() {
        this.props.getAllUsers();
        //socket.emit('new_client');
    }

    componentWillUnmount() {
        //socket.emit('client_exit');
    }

    render() {
        const usersList = this.props.users.map((x, i) => <tr>
            <td>{x.id}</td>
            <td>{x.name}</td>
            <td style={{ width: '8%' }}>{x.sex}</td>
            <td className="age" style={{ width: '8%' }}>{x.age}</td>
            <td style={{ width: '10%' }}>{x.country}</td>
            <td>{x.joindate}</td>
            <td>{x.membership}</td>
        </tr>
        )
        return (
            <Row >
                <Col style={{ marginTop: "100px" }} xs={12} sm={2}>
                    <Button onClick={() => generatePeople(2000, 5000, 5)}>
                        Generate People
                    </Button>
                    <Button onClick={() => postPerson()}>
                        Generate A Person
                    </Button>

                </Col>
                <Col style={{ marginTop: "50px" }} xs={12} sm={12} >

                    <Table condensed hover striped responsive>
                        <thead>
                            <tr>
                                <th ref="sortId">id</th>
                                <th onClick={(e) => this.handleHeadClick('name', e)}>name {this.renderCaret('name')}</th>
                                <th onClick={(e) => this.handleHeadClick('sex', e)}>sex {this.renderCaret('sex')}</th>
                                <th onClick={(e) => this.handleHeadClick('age', e)}>age {this.renderCaret('age')}</th>
                                <th onClick={(e) => this.handleHeadClick('country', e)}>country {this.renderCaret('country')}</th>
                                <th onClick={(e) => this.handleHeadClick('joindate', e)}>joindate {this.renderCaret('joindate')}</th>
                                <th onClick={(e) => this.handleHeadClick('membership', e)}>membership {this.renderCaret('membership')}</th>
                            </tr>
                        </thead>
                            <ReactCSSTransitionGroup
                            transitionName="example"
                            transitionAppear={true}
                            transitionAppearTimeout={5000}
                            transitionEnterTimeout={5000}
                            transitionLeaveTimeout={300}
                            component="tbody">
                            {usersList}
                        </ReactCSSTransitionGroup>
                    </Table>

                </Col>
            </Row>




        )
    }
}





function mapStateToProps(state) {
    return {
        users: state.users.users
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAllUsers, postPerson }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);