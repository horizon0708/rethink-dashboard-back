"use strict"

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import UserItem from './userItem';

class UsersList extends React.Component{
    componentDidMount() {
        this.props.getAllUsers();
    }

    render(){
        //const usersList = this.props.users.map(x=> <UserItem key={x._id} name={x.name} _id={x._id} />)
        return (
            <div>what</div>
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