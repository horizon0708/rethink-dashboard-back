import { Well, Table, Panel, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import { updateOneTick  } from '../actions/graphActions';

import d3 from 'd3';
//import c3 from 'c3';
import '../../public/stylesheets/c3.min.css';

class UserDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            chart: null
        }
    }
    debug = () => {
        this.props.updateOneTick(this.props.latest);
        let all = [...this.props.live.age_ge_18];
        console.log(all);
        this.chart.load({
            columns: [
                ['all', ...all],
                ['data2', 100, 200, 150, 50, 100, 250]
            ]
        })
    }

    componentDidMount() {
        this.props.updateOneTick(this.props.latest);

        if (window === undefined) { //need to disable serverside rendering
            return null;
        } else {
            const c3 = require('c3');
            var self = this;
            self.chart = c3.generate({
                bindto: '#chart',
                data: {
                    columns: [
                        ['data1', 30, 200, 100, 400, 150, 250],
                        ['data2', 50, 20, 10, 40, 15, 25]
                    ]
                }
            });
        }
    }

    render() {
        return (
            <Row style={{ marginTop: '75px' }}>
                <Col sm={6}>
                    <Well>
                        <div id="chart" />
                    </Well>
                </Col>
                <Col sm={6}>
                    <Well>
                        <button onClick={this.debug}> debug </button>
                    </Well>
                </Col>

            </Row>
        )
    }
}

//r.db('test').table('testtable').count();
//r.db('test').table('testtable').filter({sex: "M"}).count();

//r.db('test').table('testtable').filter(r.row("sex").eq("M").and(r.row("age").gt(50))).count();
//test['filter'](r.row('age').gt(50)['or'](r.row('sex').eq('F'))['or'](r.row('sex').eq('M')));

//https://stackoverflow.com/questions/20129236/creating-functions-dynamically-in-js

function mapStateToProps(state) {
    return {
        latest: state.graph.latest,
        live: state.graph.live
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateOneTick }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);