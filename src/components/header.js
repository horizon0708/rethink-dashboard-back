"use strict"
import React from 'react';
import { Nav, NavItem, Navbar, Badge } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import { updateLatest, initialiseArray, updateOneTick, debugAction } from '../actions/graphActions';

import io from 'socket.io-client';
var socket = io('https://desolate-scrubland-86860.herokuapp.com');

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            readyToReceiveNewStats: true,
            readyToReceiveNewUsers: true
        }
        socket.on('new_user', (x) => {
            if (this.state.readyToReceiveNewUsers) { 
                try{
                    this.props.getAllUsers(this.props.sort, this.props.filter);   
                }catch(err){
                    console.log(err);
                }
                console.log('new users');      
                this.setState({ readyToReceiveNewUsers: false }, () => {
                    setTimeout(() => {
                        this.setState({readyToReceiveNewUsers: true});
                    }, 2000);
                });
            }
        })

        // Only get the newest data every 2000 ms.
        // The delay is 2000ms because the realtime graph tickrate is 2000ms. 
        socket.on('new_stats', (x) => {
            if (this.state.readyToReceiveNewStats) { 
                //this.props.updateLatest();
                console.log('new stats');    
                this.setState({ readyToReceiveNewStats: false }, () => {
                    setTimeout(() => {
                        this.setState({readyToReceiveNewStats: true});
                    }, 2000);
                });
            }
        })
    }
    componentDidMount() {
        socket.emit('new_client');
        this.props.updateLatest();
    }

    componentWillUnmount() {
        socket.emit('client_exit');
    }

    render() {
        return (
            <Navbar fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href='/'>3REE-Dashboard</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem eventKey={1} href='/about'>About</NavItem>
                        <NavItem eventKey={2} href='/dashboard'>Dashboard</NavItem>
                        <NavItem eventKey={3} href='/userlist'>User List</NavItem>
                        <NavItem eventKey={4} href='https://github.com/horizon0708/rethink-dashboard-back'>Github</NavItem>
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
    return bindActionCreators({ updateOneTick, updateLatest, getAllUsers, initialiseArray, debugAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);