import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { addToCart, updateCart } from '../../actions/cartActions';

class UserItem extends React.Component{
    render(){
        return (
            <div>
                <h3>{this.props.name}</h3>
                <p>id: {this.props.id}</p>
            </div>
        )
    }
}

export default UserItem;