"use strict"
import { Form, Radio, FormGroup, ControlLabel, FormControl, HelpBlock, Table, Button, Well, Col, Row } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom';
import { updateFilterOpt ,getUniqueValues, getAllUsers } from '../actions/usersActions';
import { generatePeople, postPerson } from './userGenerator';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';


class UserListFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            range: [18, 100],
            filterCountry: 'ALL',
            filterSex: 'ALL',
            filterMembership: 'ALL'
        }
    }

    // --- Lifecycle ---
    componentDidMount() {
        this.props.getUniqueValues();
        
    }
    // --- Handle ---
    debugButton() {
    }
    handleRange = (value) => {
        this.setState({ range: value });
    }
    handleSubmit=()=> {
        let query = `age_ge_${this.state.range[0]}&age_le_${this.state.range[1]}`;
        this.state.filterSex !== 'ALL' ? query += `&sex_eq_${this.state.filterSex}` : null;
        this.state.filterCountry !== 'ALL' ? query += `&country_eq_${this.state.filterCountry}` : null;
        this.state.filterMembership !== 'ALL' ? query += `&membership_eq_${this.state.filterMembership}` : null;
        this.props.updateFilterOpt(query);
        this.props.getAllUsers(this.props.sort, query);
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

        const wrapperStyle = { margin: 10 };
        return (
            <Well>
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
            </Well>
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
        values: state.users.uniqueValues,
        filter: state.users.filter,
        sort: state.users.sort
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateFilterOpt ,getUniqueValues, getAllUsers, postPerson }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListFilter);