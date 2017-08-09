"use strict"
import { Form, Radio, FormGroup, ControlLabel, FormControl, HelpBlock, Table, Button, Well, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom';
import { getUniqueValues, getAllUsers } from '../actions/usersActions';
import UserItem from './userItem';
import { generatePeople, postPerson } from './userGenerator';
import io from 'socket.io-client';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';


class UserListFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSort: 'joindate',
            orderBy: 'desc',
            range: [18, 100],
            filterCountry: 'ALL',
            filterSex: 'ALL',
            filterMembership: 'ALL',
            sortQuery:'',
            filterQuery:`age_ge_18&age_le_100`
        }
    }

    // --- Lifecycle ---
    componentDidMount() {
        let sort = `${this.state.currentSort}_${this.state.orderBy}`;
        this.setState({sortQuery: sort});
        this.props.getAllUsers(sort);
        this.props.getUniqueValues();
    }
    // --- Handle ---
    debugButton() {
        let filterQuery = `age_ge_${this.state.range[0]}&age_le_${this.state.range[1]}`;
        this.state.filterSex !== 'ALL' ? filterQuery += `&sex_eq_${this.state.filterSex}` : null;
        this.state.filterCountry !== 'ALL' ? filterQuery += `&country_eq_${this.state.filterCountry}` : null;
        this.state.filterMembership !== 'ALL' ? filterQuery += `&membership_eq_${this.state.filterMembership}` : null;
    }

    handleRange = (value) => {
        this.setState({ range: value });
    }

    handleHeadClick(rowname, rownameTwo) {
        this.setState({ orderBy: this.state.orderBy === 'asc' ? 'desc' : 'asc' }, () => {
            this.setState({ currentSort: rowname }, () => {
                let sort = `${this.state.currentSort}_${this.state.orderBy}`;
                this.props.getAllUsers(sort, this.state.filterQuery);
            })
        })
    }
    handleSubmit=()=> {
        let query = `age_ge_${this.state.range[0]}&age_le_${this.state.range[1]}`;
        this.state.filterSex !== 'ALL' ? query += `&sex_eq_${this.state.filterSex}` : null;
        this.state.filterCountry !== 'ALL' ? query += `&country_eq_${this.state.filterCountry}` : null;
        this.state.filterMembership !== 'ALL' ? query += `&membership_eq_${this.state.filterMembership}` : null;
        this.setState({filterQuery: query})
        let sortQuery = `${this.state.currentSort}_${this.state.orderBy}`;
        this.props.getAllUsers(sortQuery, query);

    }

    handleCountrySelect = () => {
        this.setState({ filterCountry: findDOMNode(this.refs.countrySelect).value });
    }
    handleMembershipSelect = () => {
        this.setState({ filterMembership: findDOMNode(this.refs.membershipSelect).value });
    }
    handleSexSelect = () => {
        this.setState({ filterSex: findDOMNode(this.refs.sexSelect).value });
    }

    // --- Render ---
    renderCaret(rowname) {
    if (this.state.currentSort !== rowname) {
            return null;
        }
        return this.state.orderBy === 'asc' ? <i className="fa fa-caret-up" aria-hidden="true"></i> : <i className="fa fa-caret-down" aria-hidden="true"></i>
    }

    renderCountryList() {
        if (this.props.values) {
            return this.props.values.country.map((x, i) => {
                return <option key={i} value={x}>{x}</option>
            })
        }
        return null;
    }
    renderMembershipList() {
        if (this.props.values) {
            return this.props.values.membership.map((x, i) => {
                return <option key={i} value={x}>{x}</option>
            })
        }
        return null;
    }

    render() {
        const usersList = this.props.users.all.map((x, i) => <tr key={i}>
            <td>{x.id}</td>
            <td>{x.lastname}, {x.firstname}</td>
            <td style={{ width: '8%' }}>{x.sex}</td>
            <td className="age" style={{ width: '8%' }}>{x.age}</td>
            <td style={{ width: '10%' }}>{x.country}</td>
            <td>{x.joindate}</td>
            <td>{x.membership}</td>
        </tr>
        )


        const wrapperStyle = { margin: 10 };
        return (
            <Row >
                <Col style={{ marginTop: "100px" }} xs={6} sm={6}>
                    <Button onClick={() => generatePeople(1, 1, 200)}>
                        Generate People
                    </Button>
                    <Button onClick={() => postPerson()}>
                        Generate A Person
                    </Button>

                </Col>
                <Col style={{ marginTop: "100px" }} xs={12} sm={3}>
                    <Form>
                        <FormGroup controlId="name">
                            <ControlLabel>Name</ControlLabel>
                            <FormControl ref="filterName" placeholder="TODO:implement search" />
                        </FormGroup>
                    </Form>
                    <Row>
                        <Col xs={6} sm={6}>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Sex</ControlLabel>
                                <FormControl ref="sexSelect" onChange={this.handleSexSelect} componentClass="select" placeholder="ALL">
                                    <option value="ALL">All</option>
                                    <option value="F">F</option>
                                    <option value="F">M</option>
                                </FormControl>
                            </FormGroup>
                        </Col>
                    </Row>
                    <p><strong>Age Range</strong> ({this.state.range[0]}-{this.state.range[1]})</p>
                    <div style={wrapperStyle}>

                        <Range ref='range' onChange={this.handleRange} allowCross={false} min={18} max={100} defaultValue={[18, 100]} tipFormatter={value => `${value}`} />
                    </div>
                    <Row>
                        <Col xs={6} sm={6}>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Country</ControlLabel>
                                <FormControl ref="countrySelect" onChange={this.handleCountrySelect} componentClass="select" placeholder="ALL">
                                    <option value="ALL">All</option>
                                    {this.renderCountryList()}
                                </FormControl>
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={6}>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Membership</ControlLabel>
                                <FormControl ref="membershipSelect" onChange={this.handleMembershipSelect} componentClass="select" placeholder="ALL">
                                    <option value="ALL">All</option>
                                    {this.renderMembershipList()}
                                </FormControl>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Button onClick={this.handleSubmit}>
                        Filter
                    </Button>
                    <Button style={{ alignSelf: "right" }} onClick={() => this.debugButton()}>
                        Debug
                    </Button>


                </Col>
                <Col style={{ marginTop: "50px" }} xs={12} sm={12} >

                    <Table condensed hover striped responsive>
                        <thead>
                            <tr>
                                <th ref="sortId">id</th>
                                <th onClick={(e) => this.handleHeadClick('name', e)}>name {this.renderCaret('name')}</th>
                                <th onClick={(e) => this.handleHeadClick('sex', e)}>sex {this.renderCaret('sex')}</th>
                                <th onClick={(e) => this.handleHeadClick('age', e)}>age {this.renderCaret('age')}</th>
                                <th onClick={(e) => this.handleHeadClick('country', e)}>country {this.renderCaret('country')}</th>
                                <th onClick={(e) => this.handleHeadClick('joindate', e)}>joindate {this.renderCaret('joindate')}</th>
                                <th onClick={(e) => this.handleHeadClick('membership', e)}>membership {this.renderCaret('membership')}</th>
                            </tr>
                        </thead>
                        <ReactCSSTransitionGroup
                            transitionName="example"
                            transitionAppear={true}
                            transitionAppearTimeout={5000}
                            transitionEnterTimeout={5000}
                            transitionLeaveTimeout={300}
                            component="tbody">
                            {usersList}
                        </ReactCSSTransitionGroup>
                    </Table>

                </Col>
            </Row>




        )
    }
}


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

function mapStateToProps(state) {
    return {
        users: state.users.users,
        values: state.users.uniqueValues
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getUniqueValues, getAllUsers, postPerson }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);