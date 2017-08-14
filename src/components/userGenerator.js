"use strict"
import axios from 'axios';
import faker from 'faker';
import whilst from 'async/whilst';
import waterfall from 'async/waterfall';

export function generatePeople(minDelay, maxDelay, repetitions) {
    let counter = 0;
    const intervalID = window.setInterval(() => {
        send(generatePerson());
        if (++counter === repetitions) {
            window.clearInterval(intervalID);
        }
    }, getRandomInt(minDelay, maxDelay))
}

export function postPerson() {
    send(generatePerson());
}

function send(person) { // these deliberately do not use the reducer to simulate rethinkDB changefeed updates.
    axios.post('/api/user', person)
        .then(res => {
            console.log("a person has been posted!");
        })
        .catch(err => {
            console.log(err);
        })
}

function changeMembership(id, membership) {
    axios.post('/api/user/id', membership)
        .then(res => {
            console.log(`updated ${id}'s membership to ${membership}`)
        })
        .catch(err => {
            console.log(err);
        });
}

export function toggleMemberships(membership, targetNumber, totalDuration) {
    axios.get('/api/lateststats')
        .then(res => {
            let count = res.data[0][`membership_eq_${membership}`];
            let totalRep = targetNumber - count;
            whilst(
                () => { //truth test
                    return count < targetNumber
                },
                (callback) => { // function that is iterated
                    waterfall([
                        (cb) => {
                            setTimeout(() => {
                                cb();
                            }, totalDuration / totalRep);
                        },
                        (cb) => {
                            axios.get(`/api/user?filter=membership_ne_${membership}&sort=joindate_desc&limit=1`)
                                .then(res => {
                                    console.log(res);
                                    let id = res.data.data[0].id;
                                    console.log(`got the id ${id}!`);
                                    cb(null, id);
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        },
                        (id, cb) => {
                            axios.post(`/api/user/${id}`, {'membership': membership})
                                .then(res => {
                                    console.log(`updated ${id}'s membership to ${membership}`);
                                    cb()
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    ], (err, res) => {
                        count++;
                        callback(null);
                    })
                },
                (err, res) => { //result
                    if(err){console.log(err);}
                    console.log(`conversion complete`)
                })
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
        lastactive: new Date(),
        membership: getRandomMembership(),
    }
    return fakePerson;
}

export function generatePastPerson() {
    const _joindate = faker.date.past();

    const fakePerson = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        age: getRandomInt(19, 70),
        sex: getRandomSex(),
        country: getRandomCountry(),
        joindate: _joindate,
        lastactive: faker.date.between(_joindate, new Date()),
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

