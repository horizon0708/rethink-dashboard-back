import { Table, Panel, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class UserDashboard extends React.Component{
    
    
    render(){
        return (
            <div>
                <p>Total number of users</p>
                <p>Number of female users:</p>
                <p>Number of male users:</p>
            </div>
        )
    }
}

export default UserDashboard;

//r.db('test').table('testtable').count();
//r.db('test').table('testtable').filter({sex: "M"}).count();

//r.db('test').table('testtable').filter(r.row("sex").eq("M").and(r.row("age").gt(50))).count();