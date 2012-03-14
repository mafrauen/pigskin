
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less']}));
  app.use(express.cookieParser());
  app.use(express.session({secret:'u43jio34u8'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'You must be logged in to access that page.';
    res.redirect('/login/');
  }
}

// Routes


app.get('/', routes.index);

app.get('/user', routes.user_new);
app.post('/user', routes.user_create);

app.get('/login', routes.login_form);
app.post('/login', routes.login);

app.get('/logout', routes.logout);


app.get('/picks', restricted, routes.picks);
app.post('/picks', routes.submit_picks);

app.get('/results', routes.results);

app.get('/week', routes.week_new);
app.post('/week', routes.week_create);


app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
