import React from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';
import '../../public/stylesheets/c3.min.css';
import _ from 'lodash'

// title, id, array of [label , query]
class C3Donut extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (this.newUpdate(this.props.queries, nextProps)) {
            let updatedColumns = this.props.queries.map(x => [x[0], nextProps.latest[0][x[1]]]);
            this.chart.load({
                columns: updatedColumns
            })
        }
        
        
    }
    checkQueryChange (arr, nextProps) {
            for (item in arr){
                if (this.props.latest[item] !== nextProps.latest){
                    return true;
                }
            }
            return false;
    }
    componentDidMount() {    
        let startColumns = this.props.queries.map(x => [x[0], this.props.latest[0][x[1]]]);
        if (window === undefined) {
            return null;
        } else {
            const c3 = require('c3');
            var self = this;
            self.chart = c3.generate({
                bindto: `#${this.props.id}`,
                data: {
                    columns: startColumns,
                    type: 'donut'
                },
                donut: {
                    title: this.props.title
                }
            });
        }
    }

    render() {
        return (
            <div id={this.props.id} />
        )
    }
}

function mapStateToProps(state) {
    return {
        latest: state.graph.latest,
    }
}

export default connect(mapStateToProps, null)(C3Donut);