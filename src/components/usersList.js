"use strict"
import { Button, Well, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import UserItem from './userItem';
import { generatePeople, generatePerson } from './userGenerator';
import io from 'socket.io-client';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

var socket = io('http://localhost:3002/');
class UsersList extends React.Component {
    constructor(props) {
        super(props)

        socket.on('hello', (payload) => {
            console.log('hi!');
            console.log(socket);
        })

        socket.on('new_user', () => {
            console.log('renew?');
            this.props.getAllUsers();
        })
        //--

        this.state = { items: ['hello', 'world', 'click', 'me'] };
        this.handleAdd = this.handleAdd.bind(this);
    }

    //--
    handleAdd() {
        const newItems = this.state.items.concat([
            prompt('Enter some text')
        ]);
        this.setState({ items: newItems });
    }

    handleRemove(i) {
        let newItems = this.state.items.slice();
        newItems.splice(i, 1);
        this.setState({ items: newItems });
    }
    //--
    test() {
        console.log('test');
        this.props.getAllUsers();
    }

    componentDidMount() {
        this.props.getAllUsers();
        //generatePeople(500,2000,10);
        //socket.emit('new_client');
    }

    componentWillUnmount() {
        //socket.emit('client_exit');
    }

    render() {
        const usersList = this.props.users.map((x, i) => <div key={i}><UserItem
             
            name={x.name}
            id={x.id}
            sex={x.sex}
            age={x.age}
            country={x.country}
            joindate={x.joindate}
            membership={x.membership} /></div>)
        return (
            <Row >
                <Col style={{marginTop: "100px"}} xs={12} sm={2}>
                    <Button onClick={() => generatePeople(2000, 5000, 5)}>
                        Generate People
                    </Button>
                    <Button onClick={() => generatePerson()}>
                        Generate A Person
                    </Button>
                    
                </Col>
                <Col style={{marginTop: "50px"}} xs={12} sm={6} smOffset={2}>
                    <Well>
                        <ReactCSSTransitionGroup
                            transitionName="example"
                            transitionAppear={true}
                            transitionAppearTimeout={5000}
                            transitionEnterTimeout={5000}
                            transitionLeaveTimeout={300}>
                            {usersList}
                        </ReactCSSTransitionGroup>
                    </Well>
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
    return bindActionCreators({ getAllUsers }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);