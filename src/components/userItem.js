import { Table, Panel, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { addToCart, updateCart } from '../../actions/cartActions';

class UserItem extends React.Component{
    render(){
        return (
                <tr>
                    <td>{this.props.id}</td>
                    <td>{this.props.name}</td>
                    <td style={{width: '8%'}}>{this.props.sex}</td>
                    <td className="age" style={{width: '8%'}}>{this.props.age}</td>                 
                    <td style={{width: '10%'}}>{this.props.country}</td>
                    <td>{this.props.joindate}</td>
                    <td>{this.props.membership}</td>
                </tr>
        )
    }
}

export default UserItem;