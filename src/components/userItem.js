import { Panel, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { addToCart, updateCart } from '../../actions/cartActions';

class UserItem extends React.Component{
    render(){
        return (
            <Panel>
                <Row>
                    <Col>
                        
                    </Col>
                    <Col>
                        <h4>{this.props.name}</h4>
                        <p>id  : {this.props.id} </p>
                        <p>age : {this.props.age}</p>
                        <p>sex : {this.props.sex}</p>
                        <p>country   : {this.props.country}</p>
                        <p>joined at : {this.props.joindate}</p>
                        <p>membership: {this.props.membership}</p>
                    </Col>
                </Row>
            </Panel>
        )
    }
}

export default UserItem;