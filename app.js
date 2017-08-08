require('babel-core/register')({
  "presets": ["es2015", "react", "stage-1"]
})


var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

//socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('connect sc');
})

app.use(bodyParser.json());
app.use('/css', express.static(__dirname + '/public/stylesheets'));

//proxy
var httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer({
  target: 'http://localhost:3001',
});

// const wsProxy = httpProxy.createProxyServer({
//   target: ''
// })

// http.createServer(function(req,res){
//   apiProxy.web(req, res)
// }).listen(80);

app.use('/api', function(req,res){
  apiProxy.web(req, res);
})

// --- socket io
app.post('/renew', function(req,res){
  //console.log(req);
  console.log(req.body);
  io.emit('new_user', {data: 'test'});
  console.log('new_user');
  res.json({success: true});
})


app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);
app.get('*', function(req,res){
    res.sendFile(path.resolve(__dirname,'public', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

//module.exports = app;
module.exports ={ app: app, server: server, io: io }

//https://onedesigncompany.com/news/express-generator-and-socket-io