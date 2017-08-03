"use strict"
import { Button, Well, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import UserItem from './userItem';
import { generatePeople } from './userGenerator';
import io from 'socket.io-client';


var socket = io('http://localhost:3002/');
class UsersList extends React.Component {
    constructor(props){
        super(props)
       
        socket.on('hello', (payload)=>{
            console.log('hi!');
            console.log(socket);
        })

        socket.on('new_user', ()=>{
            console.log('renew?');
            this.props.getAllUsers();
        })
    }

    test(){
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
        const usersList = this.props.users.map((x) => <UserItem
            key={x.id}
            name={x.name}
            id={x.id}
            sex={x.sex}
            age={x.age}
            country={x.country}
            joindate={x.joindate}
            membership={x.membership} />)
        return (
            <Row>
                <Col xs={12} sm={2}>
                    <Button onClick={()=>generatePeople(2000,5000,5)}>
                        Generate People
                    </Button>
                </Col>
                <Col xs={12} sm={6} smOffset={2}>
                    <Well>
                        {usersList}
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