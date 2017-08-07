import { Table, Panel, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class UserDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            number: {
                total: 0,
                women: 0,
                male: 0
            }
        }

    }

    componentDidMount() {

    }


    render() {
        return (
            <div>
                <table>
                    <tr>
                        <td>Total number of users</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Number of female users:</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Number of male users:</td>
                        <td></td>
                    </tr>
                </table>
            </div>
        )
    }
}

export default UserDashboard;

//r.db('test').table('testtable').count();
//r.db('test').table('testtable').filter({sex: "M"}).count();

//r.db('test').table('testtable').filter(r.row("sex").eq("M").and(r.row("age").gt(50))).count();
//test['filter'](r.row('age').gt(50)['or'](r.row('sex').eq('F'))['or'](r.row('sex').eq('M')));

//https://stackoverflow.com/questions/20129236/creating-functions-dynamically-in-js

function mapStateToProps(state) {
    return {
        users: state.users.users
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAllUsers }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);