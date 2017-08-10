"use strict"
import React from 'react';
import { Nav, NavItem, Navbar, Badge } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';

import io from 'socket.io-client';
var socket = io('http://localhost:3002/');

class Header extends React.Component{
    constructor(props){
        super(props);
        socket.on('new_user', (x) => {
            console.log('renew?');
            this.props.getAllUsers(this.props.sort, this.props.filter);
        })
    }
    componentDidMount() {
        socket.emit('new_client');
    }

    componentWillUnmount() {
        socket.emit('client_exit');
    }

    render(){
        return(
            <Navbar fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href='/'>React-Bootstrap</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href='/about'>About</NavItem>
                        <NavItem eventKey={2} href='/contact'>Contact Us</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href='/admin'>Admin</NavItem>
                        <NavItem eventKey={2} href='/cart'>Your Cart
                            { (this.props.cartItemsNumber >0) ? (<Badge className="badge"> {this.props.cartItemsNumber} </Badge>) :(' ') }
                            
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

function mapStateToProps(state) {
    return {
        filter: state.users.filter,
        sort: state.users.sort,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAllUsers }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);