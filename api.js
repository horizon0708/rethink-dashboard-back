var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var r = require('rethinkdb');
var axios = require('axios');

//socket
var _app = require('./app');
var io = _app.io;
// --

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
// socket.io--


app.get('/socket', function(req,res){
  axios.get('http://localhost:3002/test');
  res.json({success: true});
})

// --


var connection = null;
connectToDB();
function connectToDB(){
    r.connect(config, function(err,conn){
        if(err){
            console.log(err);
        }
        console.log("connected to db!");
        connection= conn;
    })
}

var testDB = r.db('test');
var testTable = testDB.table('testtable');

app.post('/user', function(req,res){
    var user = req.body;
    user.createdAt = r.now();

    testTable.insert(user, {returnChanges: true}).run(connection, function(err, result){
        if (err){
            console.log(err);
        }
        res.json(result.changes[0].new_val);
        console.log('new user added!');
    });
});

app.get('/user', function(req,res){
    testTable.run(connection, function(err, cursor){
        if (err){
            console.log(err);
        }
        
        cursor.toArray(function(err,result){
            if(err){
                console.log(err);
            }
            
            res.json(result);
        })
    })
});

app.delete('/user/:_id', function(req,res){
    var query = req.params._id;
    testTable.get(query).delete().run(connection, function(err,result){
        if (err){
            console.log(err);
        }

        res.json({success: true});
    })
})


app.listen(3001, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('API Server is listening on http://localhost:3001');
})
module.exports = app;
