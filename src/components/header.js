"use strict"
import React from 'react';
import { Nav, NavItem, Navbar, Badge } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import { updateLatest, initialiseArray, updateOneTick } from '../actions/graphActions';



import io from 'socket.io-client';
var socket = io('http://localhost:3002/');

class Header extends React.Component{
    constructor(props){
        super(props);
        socket.on('new_user', (x) => {
            console.log('renew?');
            this.props.getAllUsers(this.props.sort, this.props.filter);
            
        })
        socket.on('new_stats',(x)=>{ // doesnt handle very short bursts of data very well
            this.props.updateLatest();
            this.props.updateOneTick(this.props.latest);
        })
    }
    componentDidMount() {
        socket.emit('new_client');
        this.props.updateLatest();
        //this.props.initialiseArray(this.props.latest);
    }

    componentWillUnmount() {
        socket.emit('client_exit');
    }

    render(){
        return(
            <Navbar fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href='/'>3REE-Dashboard</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href='/about'>About</NavItem>
                        <NavItem eventKey={2} href='/dashboard'>Dashboard</NavItem>
                        <NavItem eventKey={3} href='/userlist'>User List</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href='/admin'>Admin</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

function mapStateToProps(state) {
    return {
        latest: state.graph.latest
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({updateOneTick, updateLatest, getAllUsers, initialiseArray}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);