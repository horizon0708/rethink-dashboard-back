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

    render() {
        const allUsers= this.props.latest[0] ? this.props.latest[0].age_ge_18 : 0;
        const proUsers= this.props.latest[0] ? this.props.latest[0].membership_eq_PRO :0;
        const entUsers= this.props.latest[0] ? this.props.latest[0].membership_eq_ENTERPRISE: 0;

        return (
            <div>
                <p>Hi there! We currently have <strong>{allUsers}</strong> users. <strong>{entUsers}</strong> are enterprise users. <strong>{proUsers}</strong> are pro users. Projected Monthly Revenue is: <strong>${proUsers*6 + entUsers*25}</strong>.</p>
                <p>Click the button below to change the numbers up!</p>
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