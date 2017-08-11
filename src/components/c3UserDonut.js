import { Well, Table, Panel, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllUsers } from '../actions/usersActions';
import { updateOneTick } from '../actions/graphActions';
import UserGenerateButton from './userGenerateButton';

import d3 from 'd3';
import '../../public/stylesheets/c3.min.css';


class C3UserDonut extends React.Component {
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        let free = nextProps.latest[0].membership_eq_FREE;
        let enterprise = nextProps.latest[0].membership_eq_ENTERPRISE;
        let pro = nextProps.latest[0].membership_eq_PRO;
        this.chart.load({
            columns: [
                ['Free', free],
                ['Pro', pro],
                ['Enterprise', enterprise]
            ]
        })
    }

    componentDidMount() {
        let free = [...this.props.latest[0].membership_eq_FREE];
        let enterprise = [...this.props.latest[0].membership_eq_ENTERPRISE];
        let pro = [...this.props.latest[0].membership_eq_PRO];
        
        if (window === undefined) {
            return null;
        } else {
            const c3 = require('c3');
            var self = this;
            self.chart = c3.generate({
                bindto: '#donut',
                data: {
                    columns: [
                        ['Free', 120],
                        ['Pro', 130],
                        ['Enterprise', 300]
                    ],
                    type: 'donut',
                    onclick: function (d, i) { console.log("onclick", d, i); },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                },
                donut: {
                    title: "User Payment Dist."
                }
            });
        }
    }

    render() {
        return (
            <div id="donut" />
        )
    }
}

function mapStateToProps(state) {
    return {
        latest: state.graph.latest,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateOneTick }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(C3UserDonut);