var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var r = require('rethinkdb');
var axios = require('axios');
var waterfall = require('async/waterfall');
var whilst = require('async/whilst');
//var async = require('async');
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

//i have to say this feels like the most hackiest thing i've ever done
app.get('/socket', function (req, res) {
    axios.get('http://localhost:3002/test');
    res.json({ success: true });
})

// --


var connection = null;
var testDB = r.db('test');
var testTable = testDB.table('testtable');
var statsTable = testDB.table('dailyStats');

connectToDB().then(() => {
    testTable.changes().run(connection, function (err, cursor) {
        if (err) {
            console.log(err);
        }
        cursor.each((err, change) => {
            updateStats();
            axios.get('https://desolate-scrubland-86860.herokuapp.com/renew')
                .then(res => null)
                .catch(error => console.log("axios error"));

        })
    });
    statsTable.changes().run(connection, function (err, cursor) {
        if (err) { console.log(err) };
        cursor.each((err, change) => {
            axios.get('https://desolate-scrubland-86860.herokuapp.com/renewstats')
                .then(res => null)
                .catch(error => console.log('axios stats error'));
        })
    });
})


function connectToDB() {
    return r.connect(config, function (err, conn) {
        if (err) {
            console.log(err);
        }
        console.log("connected to db!");
        connection = conn;
    })
}
//https://webapplog.com/reactive-web-stack/

app.get('/statstest', function (req, res) {
    var count = 0;
    async.whilst(
        function () { return count < 5; },
        function (callback) {
            count++;
            setTimeout(function () {
                callback(null, count);
            }, 1000);
        },
        function (err, n) {
            // 5 seconds have passed, n = 5
            console.log('done');
        }
    );
});

app.get('/lateststats', function (req, res) {
    statsTable.orderBy(r.desc('datetime')).limit(1).run(connection, function (err, cursor) {
        if (err) {
            console.log(err);
        }
        cursor.toArray((err, result) => {
            if (err) {
                console.log(err);
            }
            res.json(result);
        });
    })
})


function updateStats() {
    // everytime there is a change in the database, update the stats db
    const inputData = {
        datetime: new Date()
    }
    var count = 0;
    whilst(
        function () { return count < queryList.length },
        function (cb) {
            let currentQuery = queryList[count];
            count++;
            let [row, op, value] = currentQuery.split('_');
            
            value = parseInt(value) ? value : `'${value}'`;
            var query = new Function('r', `return r.row('${row}').${op}(${value});`);

            testTable.filter(query(r)).count().run(connection, function (err, cursor) {
                if (err) { console.log(err) }
                inputData[currentQuery] = cursor;
                cb(null);
            });
        },
        function (err) {
            statsTable.insert(inputData).run(connection, function (err, cursor) {
                if (err) { console.log(err); }
                console.log(`stats updated!`);
            })
        }
    );
}

const queryList = [
    'age_ge_18', //all users
    'sex_eq_M',
    'sex_eq_F',
    'membership_eq_FREE',
    'membership_eq_ENTERPRISE',
    'membership_eq_PRO',
    'country_eq_UK',
    'country_eq_NZ',
    'country_eq_AU',
]


app.post('/user', function (req, res) {
    var user = req.body;
    user.createdAt = r.now();

    testTable.insert(user, { returnChanges: true }).run(connection, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.json(result.changes[0].new_val);
        console.log('new user added!');
    });
});

app.post('/user/:id', (req,res)=> {
    let userID = req.params.id;
    let changes = req.body;
    testTable.get(userID).update(
        changes
    ).run(connection, (err, cursor)=>{
        if(err){
            console.log(err);
        }
       res.json({success : true}) ;
    });
});

app.get('/user', function (req, res) {
    var querySort = req.query.sort;
    var queryFilter = req.query.filter;
    var limit = req.query.limit ? parseInt(req.query.limit): 200;
    let filterFunc = 'return ';
    let sortFunc = 'return ';

    // generate a function for for .filter()
    if (queryFilter) {
        const splitQueries = queryFilter.split('&');
        for (var i = 0; i < splitQueries.length; i++) {
            let [row, op, value] = splitQueries[i].split(['_']);
            value = parseInt(value) ? value : `'${value}'`;
            if (i > 0) {
                filterFunc += '.and';
            }
            filterFunc += `(r.row('${row}').${op}(${value}))`;
        }
    } else { // cannot return undefined
        filterFunc += '{}'
    }
    filterFunc = new Function('r', `${filterFunc};`);

    //  generate a function for .orderBy()
    if (querySort) {
        let [row, order] = querySort.split('_');
        sortFunc += row === 'name' ? `{index:r.${order}('fullname')}` : `r.${order}('${row}')`;
    } else {  //Default behaviour: sort by joindate_ascending
        sortFunc += `r.asc('joindate')`;
    }
    sortFunc = new Function('r', `${sortFunc};`);



    // run the query to the DB
    testTable.orderBy(sortFunc(r)).filter(filterFunc(r)).limit(limit).run(connection, function (err, cursor) {
        if (err) {
            console.log(err);
        }
        cursor.toArray(function (err, result) {
            if (err) {
                console.log(err);
            }
            res.json({
                data: result,
                length: result.length
            });
        });
    });
});


app.get('/valuelist', function (req, res) {
    var uniqueValues = {
        country: [],
        membership: []
    }
    waterfall([
        function (callback) {
            testTable.distinct({ index: 'country' }).run(connection, function (err, cursor) {
                if (err) { callback(err) };
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    uniqueValues.country = result;
                    callback();
                })
            });
        },
        function (callback) {
            testTable.distinct({ index: 'membership' }).run(connection, function (err, cursor) {
                if (err) { callback(err) };
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    uniqueValues.membership = result;
                    callback();
                })
            });
        }
    ], function (err, result) {
        if (err) { console.log(err); }
        res.json(uniqueValues);
    });
})

//add params
app.get('/userbydate', function (req, res) {
    testTable.orderBy(r.desc('joindate')).run(connection, function (err, cursor) {
        if (err) {
            console.log(err);
        }

        cursor.toArray(function (err, result) {
            if (err) {
                console.log(err);
            }

            res.json(result);
        })
    })
});

app.delete('/user/:id', function (req, res) {
    var query = req.params.id;
    testTable.get(query).delete().run(connection, function (err, result) {
        if (err) {
            console.log(err);
        }

        res.json({ success: true });
    })
})


app.listen(3001, function (err) {
    if (err) {
        return console.log(err);
    }
    console.log('API Server is listening on http://localhost:3001');
})
module.exports = app;
