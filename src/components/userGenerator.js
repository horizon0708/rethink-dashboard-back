"use strict"
import axios from 'axios';
import faker from 'faker';

export function generatePeople(minDelay, maxDelay, repetitions) {
    let counter = 0;
    const intervalID = window.setInterval(()=>{
        send(generatePastPerson());
        if(++counter === repetitions){
            window.clearInterval(intervalID);
        }
    }, getRandomInt(minDelay,maxDelay))
} 

export function postPerson(){
    send(generatePerson());
}

function send(person) { // this deliberately does not use the reducer to simulate rethinkDB changefeed updates.
    axios.post('/api/user', person)
        .then(res => {
            console.log("a person has been posted!");
        })
        .catch(err => {
            console.log(err);
        })
}

export function generatePerson() {
    const fakePerson = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        age: getRandomInt(19, 70),
        sex: getRandomSex(),
        country: getRandomCountry(),
        joindate: new Date(),
        membership: getRandomMembership(),
    }
    return fakePerson;
}

export function generatePastPerson() {
    const fakePerson = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        age: getRandomInt(19, 70),
        sex: getRandomSex(),
        country: getRandomCountry(),
        joindate: faker.date.past(),
        membership: getRandomMembership(),
    }
    return fakePerson;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSex() {
    return Math.random() > 0.423 ? "M" : "F";
}

function getRandomCountry() {
    let rand = Math.random();
    if (rand > 0.80) {
        return "UK";
    } else if (rand > 0.25) {
        return "NZ";
    } else {
        return "AU";
    }
}

function getRandomMembership() {
    let rand = Math.random();
    if (rand > 0.20) {
        return "FREE";
    } else if (rand > 0.05) {
        return "PRO";
    } else {
        return "ENTERPRISE";
    }
}

