import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleMemberships } from '../actions/usersActions';
import { Button } from 'react-bootstrap';

class UserDashboardAbout extends Component {
    constructor() {
        super();
        this.toggleGeneration = this.toggleGeneration.bind(this);
    }

    toggleGeneration() {
        console.log(this.props);
        const puPercent = this.props.latest[0].membership_eq_PRO / this.props.latest[0].age_ge_18 * 100
        const euPercent = this.props.latest[0].membership_eq_ENTERPRISE / this.props.latest[0].age_ge_18 * 100
        
        if (50 >= this.props.latest[0].membership_eq_PRO / this.props.latest[0].age_ge_18 * 100) {
            console.log('increasing pro members!');
            const target = Math.round((51) / 100 * this.props.latest[0].age_ge_18);
            this.props.toggleMemberships("PRO", target, 20000)
        } else {
            const target = Math.round((51) / 100 * this.props.latest[0].age_ge_18);
            this.props.toggleMemberships("ENTERPRISE", target, 20000)
        }
        
    }

    renderGenerateButton(){
        if (this.props.status) {
            console.log(this.props.status)
            return <Button disabled>
            Toggling Memberships...
        </Button>
        }
        return <Button onClick={this.toggleGeneration}>
            {50 >= this.props.latest[0].membership_eq_PRO / this.props.latest[0].age_ge_18 * 100? "Increase Pro users" : "Increase Enterprise users"}
        </Button>        
    }
    // going to be lazy and just copy paste functions

    renderGenerateButton(){
        if (this.props.status) {
            console.log(this.props.status)
            return <Button disabled>
            Toggling National Allegiance...
        </Button>
        }
        return <Button onClick={this.toggleGeneration}>
            {50 >= this.props.latest[0].membership_eq_PRO / this.props.latest[0].age_ge_18 * 100? "Switch Aussies to Kiwis" : "Switch Kiwis to Aussies"}
        </Button>        
    }

    render() {
        return (
            <div>
                {this.renderGenerateButton()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        latest: state.graph.latest,
        status: state.status.generating
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleMemberships }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboardAbout);