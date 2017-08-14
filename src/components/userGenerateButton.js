import React from 'react';
import { toggleMemberships,generatePeople, postPerson } from './userGenerator';
import { ButtonGroup ,Well, Col, Button } from 'react-bootstrap';

class UserGenerateButton extends React.Component {
    render() {
        return (
            <Well>
                <ButtonGroup>
                    <Button onClick={() => generatePeople(1, 1, 200)}>
                        Generate 200 People
                    </Button>
                    <Button onClick={() => generatePeople(1000, 3000, 25)}>
                        Generate 25 People over sometime.
                    </Button>
                    <Button onClick={() => postPerson()}>
                        Generate A Person
                    </Button>
                    <Button onClick={() => toggleMemberships("ENTERPRISE", 600, 20000)}> 
                        toggleMemberships
                    </Button>
                </ButtonGroup>        
            </Well>
        )
    }
}

export default UserGenerateButton;