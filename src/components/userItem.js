import { Table, Panel, Col, Row } from 'react-bootstrap';
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
                        <h4>{this.props.name}</h4>
                        <Table condensed hover>
                            <tbody>
                                <tr>
                                    <td>id</td>
                                    <td>{this.props.id}</td>
                                </tr>
                                <tr>
                                    <td>age</td>
                                    <td>{this.props.age}</td>
                                </tr>
                                <tr>
                                    <td>sex</td>
                                    <td>{this.props.sex}</td>
                                </tr>
                                <tr>
                                    <td>country</td>
                                    <td>{this.props.country}</td>
                                </tr>
                                <tr>
                                    <td>joined</td>
                                    <td>{this.props.joindate}</td>
                                </tr>
                                <tr>
                                    <td>membership</td>
                                    <td>{this.props.membership}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Panel>
        )
    }
}

export default UserItem;