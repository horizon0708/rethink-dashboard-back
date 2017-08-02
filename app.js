var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var config = {
    host: 'ec2-54-193-77-15.us-west-1.compute.amazonaws.com',
    port: 28015,
    db: 'test',
    user: 'test',
    password: 'testjames'
}
var connection = null;

function connectToDB(){
    r.connect(config, function(err,coon){
        if(err){

        }
        connection= conn;
    })
}

function insert(){
    r.db('test').table('testtable'.insert({'name': 'shinobu'})).run(connection);
}