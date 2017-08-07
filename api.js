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

//i have to say this feels like the most hackiest thing i've ever done
app.get('/socket', function (req, res) {
    axios.get('http://localhost:3002/test');
    res.json({ success: true });
})

// --


var connection = null;
var testDB = r.db('test');
var testTable = testDB.table('testtable');

connectToDB().then(() => {
    testTable.changes().run(connection, function (err, cursor) {
        if (err) {
            console.log(err);
        }
        cursor.each((err, change) => {
            console.log('changes!');
            axios.get('http://localhost:3002/renew', change)
        })

    })
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

app.get('/user/', function (req, res) {
    // get one user
    //maybe better to have filter object?
    var queryId = req.query.id;
    var queryOrderRow = req.query.orderrow;
    var queryOrderBy = req.query.orderby
    var queryFilterRow = req.query.filterrow;
    var queryFilterBy = req.query.filterby

    var queryFilter = req.query.filter;
    //req.query.filter ? queryFilter = JSON.parse(req.query.filter): null;
    //var teststring = req.query.string;
    console.log(queryFilter);


    if (queryId) {
        testTable.get(queryId).run(connection, function (err, cursor) {
            if (err) {
                console.log(err);
            }
            res.json(cursor);
        })
    } else if ((queryOrderRow && queryOrderBy) || queryFilter) {


        const splitQueries = queryFilter.split('&');
        let filterFunc = 'return ';
        for (var i = 0; i < splitQueries.length; i++) {
            const splitParam = splitQueries[i].split(['_']);
            let row = splitParam[0];
            let op = splitParam[1];
            let value = null;
            parseInt(splitParam[2]) ? value = splitParam[2] : value =  `'${splitParam[2]}'`;
            //let filterInner = "(r.row('" + row + "\')" + "." + op + "(" + value + "))";
            let filterInner = `(r.row('${row}').${op}(${value}))`;
            if (i > 0) {
                filterFunc += '.and';
            }
            filterFunc += filterInner;
        }
        filterFunc += ';';
        console.log(filterFunc);
        const filterArg = new Function('r', filterFunc);




        let filter = {};
        if (queryFilter) {
            filter = queryFilter;
        }
        console.log(filter);
        if (queryOrderBy === 'descending') {
            testTable.orderBy(r.desc(queryOrderRow)).filter(filter).run(connection, function (err, cursor) {
                if (err) {
                    console.log(err);
                }
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    res.json({
                        data: result,
                        number: result.length
                    });
                });
            });
        } else if (queryOrderBy === 'ascending') {
            testTable.orderBy(r.asc(queryOrderRow)).filter(filter).run(connection, function (err, cursor) {
                if (err) {
                    console.log(err);
                }
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    res.json({
                        data: result,
                        number: result.length
                    });
                });
            });
        } else {
            testTable.filter(filterArg(r)).run(connection, function (err, cursor) {
                if (err) {
                    console.log(err);
                }
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    res.json({
                        data: result,
                        number: result.length
                    });
                });
            });
        }

    } else {
        testTable.run(connection, function (err, cursor) {
            if (err) {
                console.log(err);
            }

            cursor.toArray(function (err, result) {
                if (err) {
                    console.log(err);
                }

                res.json(result);
            });
        })
    }
});


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

app.delete('/user/:_id', function (req, res) {
    var query = req.params._id;
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
