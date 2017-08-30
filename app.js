require('babel-core/register')({
  "presets": ["es2015", "react", "stage-1"]
})
require.extensions['.css'] = () => {
  return;
};

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var requestHandler = require('./requestHandler');

//socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server,{origins: "*:*"});

io.on('connection', function(socket){
  console.log('connect sc');
})


app.use('/css', express.static(__dirname + '/public/stylesheets'));

//proxy
// var httpProxy = require('http-proxy');
// const apiProxy = httpProxy.createProxyServer({
//   target: 'http://localhost:3001',
//   //ws: true
// });

// app.use('/api', function(req,res){
//   apiProxy.web(req, res);
// })


// --- socket io

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


/// API
var r = require('rethinkdb');
var axios = require('axios');
var waterfall = require('async/waterfall');
var whilst = require('async/whilst');

var config = {
  host: 'ec2-54-193-77-15.us-west-1.compute.amazonaws.com',
  port: 28015,
  db: 'test',
  user: 'test',
  password: 'testjames'
}
// socket.io--

//i have to say this feels like the most hackiest thing i've ever done

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
          io.emit('new_user', {x: 'test'});


      })
  });
  statsTable.changes().run(connection, function (err, cursor) {
      if (err) { console.log(err) };
      cursor.each((err, change) => {
          io.emit('new_stats');
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

app.get('/api/statstest', function (req, res) {
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

app.get('/api/lateststats', function (req, res) {
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


app.post('/api/user', function (req, res) {
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

app.post('/api/user/:id', (req,res)=> {
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

app.get('/api/user', function (req, res) {
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


app.get('/api/valuelist', function (req, res) {
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
app.get('/api/userbydate', function (req, res) {
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

app.delete('/api/user/:id', function (req, res) {
  var query = req.params.id;
  testTable.get(query).delete().run(connection, function (err, result) {
      if (err) {
          console.log(err);
      }

      res.json({ success: true });
  })
})


////
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// disabling serverside rendering for now
app.set('view engine', 'ejs');
app.use(requestHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
});

//module.exports = app;
module.exports ={ app: app, server: server, io: io }

//https://onedesigncompany.com/news/express-generator-and-socket-io