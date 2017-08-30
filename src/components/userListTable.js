"use strict"
import { Table } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSortOpt, getAllUsers } from '../actions/usersActions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class UserListTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSort: 'joindate',
            orderBy: 'desc',
        }
    }

    // --- Handle ---
    handleHeadClick(rowname, rownameTwo) {
        this.setState({ orderBy: this.state.orderBy === 'asc' ? 'desc' : 'asc' }, () => {
            this.setState({ currentSort: rowname }, () => {
                let sort = `${this.state.currentSort}_${this.state.orderBy}`;
                this.props.updateSortOpt(sort);
                this.props.getAllUsers(sort, this.props.filter);
            })
        })
    }

    // --- Render ---
    renderCaret(rowname) {
    if (this.state.currentSort !== rowname) {
            return null;
        }
        return this.state.orderBy === 'asc' ? <i className="fa fa-caret-up" aria-hidden="true"></i> : <i className="fa fa-caret-down" aria-hidden="true"></i>
    }
    renderUserList(){
        if(this.props.users){
            return this.props.users.map((x, i) => <tr key={i}>
            <td>{x.id}</td>
            <td>{x.lastname}, {x.firstname}</td>
            <td style={{ width: '8%' }}>{x.sex}</td>
            <td className="age" style={{ width: '8%' }}>{x.age}</td>
            <td style={{ width: '10%' }}>{x.country}</td>
            <td>{x.joindate}</td>
            <td>{x.membership}</td>
        </tr>
            );
        }
        return null;
    }

    render() {
        return (
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
                            {this.renderUserList()}
                        </ReactCSSTransitionGroup>
                    </Table>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users.users,
        filter: state.users.filter,
        sort: state.users.sort
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateSortOpt, getAllUsers }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListTable);