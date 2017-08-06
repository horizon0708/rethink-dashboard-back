"use strict"
import React from 'react';
import { Nav, NavItem, Navbar, Badge } from 'react-bootstrap';

class Header extends React.Component{
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

export default Header