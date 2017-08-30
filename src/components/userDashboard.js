import { Table, Panel, Col, Row, FormGroup, Checkbox } from 'react-bootstrap';
import React from 'react';
import C3Donut from './c3Donut';
import C3RealTime from './c3RealTime';
import UserGenerateButton from './userGenerateButton';
import UserDashboardAbout from './userDashboardAbout';

class UserDashboard extends React.Component {
    render() {

        return (

                <Row>
                    <Col xs={12} style={{ marginTop: '75px' }}>
                        <Row>
                            <Col xs={12} sm={8}>
                                <Panel>
                                    <C3RealTime
                                        title='Realtime User Number'
                                        id='realTimeUserNumberMonitor'
                                        queries={[
                                            ['Free', 'membership_eq_FREE', false],
                                            ['Pro', 'membership_eq_PRO', true],
                                            ['Enterprise', 'membership_eq_ENTERPRISE', true],
                                            ['All', 'age_ge_18', true],
                                            ['Male', 'sex_eq_M', false],
                                            ['Female', 'sex_eq_F', false],
                                            ['UK', 'country_eq_UK', false],
                                            ['NZ', 'country_eq_NZ', false],
                                            ['AU', 'country_eq_AU', false]
                                        ]}
                                    />
                                </Panel>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Panel>
                                        <UserDashboardAbout />
                                </Panel>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={12}>
                        <Row>
                            <Col xs={12} sm={4}>
                                <Panel>
                                    <C3Donut
                                        title='User Payment Dist.'
                                        id='userPaymentDonut'
                                        queries={[
                                            ['Free', 'membership_eq_FREE'],
                                            ['Pro', 'membership_eq_PRO'],
                                            ['Enterprise', 'membership_eq_ENTERPRISE']
                                        ]}
                                    />
                                </Panel>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Panel>
                                    <C3Donut
                                        title='User Gender'
                                        id='GenderDonut'
                                        queries={[
                                            ['Male', 'sex_eq_M'],
                                            ['Female', 'sex_eq_F']
                                        ]} />
                                </Panel>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Panel>
                                    <C3Donut
                                        title='User Country Dist.'
                                        id='userCountryDonut'
                                        queries={[
                                            ['NZ', 'country_eq_NZ'],
                                            ['AU', 'country_eq_AU'],
                                            ['UK', 'country_eq_UK']
                                        ]} />
                                </Panel>
                            </Col>
                        </Row>
                    </Col>
                </Row>
        )
    }
}


export default UserDashboard;