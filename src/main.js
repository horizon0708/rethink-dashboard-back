"use strict"
import React from 'react';
import Header from './components/header';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';

class Main extends React.Component{
    componentDidMount() {
    }
    
    render(){
        return(
            <div>
                <Header />
                    {this.props.children}/>
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