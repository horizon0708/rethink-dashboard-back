import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateOneTick } from '../actions/graphActions';
import moment from 'moment';
import { Col, Row, Checkbox } from 'react-bootstrap';
import d3 from 'd3';
//import c3 from 'c3';
import '../../public/stylesheets/c3.min.css';


class C3RealTime extends React.Component {
    constructor() {
        super();
        this.state = {
            showing: []
        }
    }

    handleQuerySelect(e, value) {
        this.setState({
            showing: this.state.showing.map(x => {
                if (x.query === value) {
                    return {
                        ...x,
                        show: !x.show
                    };
                }
                return x;
            })
        }, this.chart.unload({
            ids: this.state.showing.filter(x => x.query === value).map(x=> x.title)
        }));

    }

    update = () => {
        this.props.updateOneTick(this.props.latest);
        let updatedColumns = this.state.showing.filter(x => x.show).map(x=> [x.title, ...this.props.live[x.query]]);
        let time = [...this.props.live.time].map(x => x = moment(x).format('YYYY-MM-DD HH:mm:ss'));
        this.chart.load({
            columns: [['x', ...time],
            ...updatedColumns
            ]
        });
    }
    componentDidMount() {
        this.props.updateOneTick(this.props.latest);

        this.setState({ showing: this.createDefaultState(this.props.queries) }, () => {
            let startColumns = this.props.queries.map(x => [x[0]])
            if (window === undefined) {
                return null;
            } else {
                const c3 = require('c3');
                var self = this;
                self.chart = c3.generate({
                    bindto: `#${this.props.id}`,
                    data: {
                        x: 'x',
                        xFormat: '%Y-%m-%d %H:%M:%S',
                        columns: [
                            ['x'],
                            ...startColumns
                        ],
                        type: 'spline'
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
                    },
                    title: this.props.title
                });

                self.timer = setInterval(() => this.update(), 2000);
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    createDefaultState(arr) {
        return arr.map(x => {
            return {
                title: x[0],
                query: x[1],
                show: x[2]
            }
        });
    }

    render() {
        const checkBoxList = this.state.showing.map((x,i)=> <Checkbox key={i} checked={x.show} onChange={evt => this.handleQuerySelect(evt, x.query)}>{x.title}</Checkbox>)

        return (
            <Row>
                <Col xs={12} style={{textAlign: 'center'}}>
                    <h2>{this.props.title}</h2>
                </Col>
                <Col xs={10}>
                    <div id={this.props.id} />
                </Col>
                <Col xs={2} style={{marginTop: '15px'}}>
                    {checkBoxList}
                </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(C3RealTime);