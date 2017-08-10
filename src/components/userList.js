"use strict"
import { Col, Row } from 'react-bootstrap';
import React from 'react';
import UserListFilter from './userListFilter';
import UserListTable from './userListTable';
import UserGenerateButton from './userGenerateButton';

class UserList extends React.Component {
    render() {
        return (
            <Row style={{marginTop: '100px'}}>
                <Col xs={12} sm={4}>
                    <UserListFilter />
                    <UserGenerateButton />
                </Col>
                <Col xs={12} sm={8}>
                    <UserListTable />
                </Col>
            </Row>      
        )
    }
}
export default UserList;