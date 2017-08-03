"use strict"

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import UserItem from './userItem';
import { generatePeople} from './userGenerator';

class UsersList extends React.Component{
    componentDidMount() {
        this.props.getAllUsers();
        generatePeople(500,2000,10);
    }

    render(){
        const usersList = this.props.users.map((x)=> <UserItem key={x.id} name={x.name} id={x.id} />)
        return (
            <div>{usersList} what</div>
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