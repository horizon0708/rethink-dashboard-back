import { Well, Table, Panel, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import { updateOneTick } from '../actions/graphActions';
import moment from 'moment';

import C3Donut from './c3Donut';
import UserGenerateButton from './userGenerateButton';
import C3UserDonut from './c3UserDonut';

import d3 from 'd3';
//import c3 from 'c3';
import '../../public/stylesheets/c3.min.css';


class UserDashboard extends React.Component {
    manualUpdate = () => {
        this.props.updateOneTick(this.props.latest);
        let all = [...this.props.live.age_ge_18];
        let enterprise = [...this.props.live.membership_eq_ENTERPRISE];
        let premium = [...this.props.live.membership_eq_PRO].map((x,i)=> x + enterprise[i]);        
        let time = [...this.props.live.time].map(x => x = moment(x).format('YYYY-MM-DD HH:mm:ss'));
        this.setTick.load({
            columns: [
                ['x', ...time],
                ['all', ...all],
                ['Premium Users', ...premium]
            ]
        })
    }
    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        this.props.updateOneTick(this.props.latest);

        if (window === undefined) {
            return null;
        } else {
            const c3 = require('c3');
            var self = this;
            self.setTick = c3.generate({
                bindto: '#chart_set_tick',
                data: {
                    x: 'x',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    columns: [
                        ['x'],
                        ['All Users'],
                        ['Premium Users'],
                    ],
                    type: 'area-spline'
                },
                
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

            self.timer = setInterval(()=>this.manualUpdate(), 2000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <Row style={{ marginTop: '75px' }}>
                <Col sm={6}>
                    <Well>
                        <div id="chart_set_tick" />
                    </Well>
                </Col>
                <Col sm={6}>
                    <Well>
                        <C3UserDonut />

                    </Well>
                </Col>
                <Col sm={6}>
                    <Well>
                        <C3Donut 
                        title='User Gender' 
                        id='GenderDonut' 
                        queries={[
                            ['Male', 'sex_eq_M'],
                            ['Female', 'sex_eq_F']
                        ]}/>

                    </Well>
                </Col>
                <UserGenerateButton />
            </Row>
        )
    }
}

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