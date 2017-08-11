import { Well, Table, Panel, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import { updateOneTick } from '../actions/graphActions';
import moment from 'moment';

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
        console.log('debug');
        let all = [...this.props.live.age_ge_18];
        let pro = [...this.props.live.membership_eq_PRO];
        let Enterprise = [...this.props.live.membership_eq_ENTERPRISE];
        let time = [...this.props.live.time].map(x => x = moment(x).format('YYYY-MM-DD HH:mm:ss'));
        this.chart.load({
            columns: [
                ['x', ...time],
                ['all', ...all],
                ['Pro', ...pro],
                ['Enterprise', ...Enterprise]
            ]
        })
    }
    componentWillReceiveProps(nextProps) {
        let all = [...nextProps.live.age_ge_18];
        let pro = [...nextProps.live.membership_eq_PRO];
        let Enterprise = [...nextProps.live.membership_eq_ENTERPRISE];
        let time = [...nextProps.live.time].map(x => x = moment(x).format('YYYY-MM-DD HH:mm:ss'));
        this.chart.load({
            columns: [
                ['x', ...time],
                ['All', ...all],
                ['Pro', ...pro],
                ['Enterprise', ...Enterprise]
            ]
        });
    }

    componentDidMount() {
        this.props.updateOneTick(this.props.latest);

        if (window === undefined) { //c3 does not support serverside rendering
            return null;
        } else {
            const c3 = require('c3');
            var self = this;
            self.chart = c3.generate({
                bindto: '#chart',
                data: {
                    x: 'x',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    columns: [
                        ['x'],
                        ['All'],
                        ['Pro'],
                        ['Enterprise']
                    ]
                },
                type: 'area-spline',
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: `%H:%M:%S`
                        }
                    }
                },
                point: {
                    show: false
                }
            });
            //self.timer = setInterval(()=>this.debug(), 2000);
        }
    }

    componentWillUnmount() {
        //clearInterval(this.timer);
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