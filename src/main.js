"use strict"
import React from 'react';
import Header from './components/header';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { getAllUsers } from './actions/usersActions';

class Main extends React.Component{
    render(){
        return(
            <div>
                <Header />
                    {this.props.children}
            </div>
        );
    }
}

function mapStateToProps(state){
    return{
        // add number of new members as badge?
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);