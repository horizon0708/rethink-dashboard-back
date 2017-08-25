"use strict"
import { Col, Row, Panel } from 'react-bootstrap';
import React from 'react';


class About extends React.Component {
    render() {
        return (
            <Row style={{marginTop: '100px'}}>
                <Col smOffset={1} sm={10}>
                    <Panel>
                     <h1>About</h1>

        <h1 id="whatisthis">What is this?</h1>

        <p>I made this isomoprhic real-time dashboard app in order to learn RethinkDB, C3 ,socket.io and Express (graphs are not rendered on server-side because of C3). Front-end is hosted on Heroku, DB is hosted on Amazon EC2.</p>

        <h2 id="backend">Back-end</h2>

        <p>Back-end is made with RethinkDB and Express.</p>

        <p>RethinkDB is a NoSQL DB with a cool feature called 'changefeed' which can push data whenever there has been a change in the DB.  I have used this feature to have a secondary collection that logs the changes in user numbers whenever there is a change in the main collections. Then, whenever there is a change in the secondary collection, it communicates the change to the front-end, using socket.io.</p>

        <h2 id="frontend">Front-end</h2>

        <p>Front-end is made with React-Redux and C3.js.</p>

        <p>Whenever there is a change in the RethinkDB, socket.io will trigger an action. This action fetches data using Redux-Thunk and Axios to update the store. This action can only happen once every 2 seconds for optimisation. Since the real-time timeseries graph gets updated every 2 seconds, there is no need to flood the server with AJAX calls every millisecond if there has been a huge influx or change of users.</p>

        <p>The donut graphs only re-renders when there are differences between the  current props and the next props in <code>componentWillReceiveProps</code>, again, for optimisation.</p>

        <p>Both time-series graph and the donuts are reusable components. </p>

        <p>Source code at:  https://github.com/horizon0708/rethink-dashboard-back</p>

        <h2 id="todos">Todos:</h2>

        <p>[ ] Paginations for userlist - it's currently capped at 200.</p>
        <p>[ ] search feature for userlist.</p>
                        

                    </Panel>
                </Col>
            </Row>      
        )
    }
}
export default About;