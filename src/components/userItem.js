import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { addToCart, updateCart } from '../../actions/cartActions';

class userItem extends React.Component{
    render(){
        return (
            <div>
                <h3>{this.props.name}</h3>
                <p>id: {this.props._id}</p>
            </div>
        )
    }
}