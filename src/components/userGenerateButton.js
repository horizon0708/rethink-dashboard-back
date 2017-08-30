import React from 'react';
import { toggleMemberships,generatePeople, postPerson } from './userGenerator';
import { ButtonGroup ,Well, Col, Button } from 'react-bootstrap';

class UserGenerateButton extends React.Component {
    render() {
        return (
            <Well>
                <ButtonGroup>
                    <Button disabled onClick={() => generatePeople(1, 1, 200)}>
                        Add 200 People.
                    </Button>
                    <Button onClick={() => postPerson()}>
                        Add A Person
                    </Button>
                </ButtonGroup>        
            </Well>
        )
    }
}

export default UserGenerateButton;