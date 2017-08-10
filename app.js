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
var io = require('socket.io')(server,{origins: "localhost:3002"});

io.on('connection', function(socket){
  console.log('connect sc');
})


app.use('/css', express.static(__dirname + '/public/stylesheets'));

//proxy
var httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer({
  target: 'http://localhost:3001',
});

app.use('/api', function(req,res){
  apiProxy.web(req, res);
})



// --- socket io

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/renew', function(req,res){
  //console.log(req);
  //console.log(req.body);
  io.emit('new_user', {x: 'test'});
  console.log('new_user');
  res.json({success: true});
})

app.get('/renewstats', function(req,res){
  io.emit('new_stats');
  res.json({success: true});
})

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

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