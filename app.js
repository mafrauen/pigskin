/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , model = require('./model')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

function teamName(team, isFavorite) {
  if (isFavorite) return team + '*';
  return team;
}

function entryForWeek(user, week) {
  for (var w = 0; w < user.entries.length; w++) {
    if (user.entries[w] && user.entries[w].week*1 === week*1) {
      return user.entries[w];
    }
  }
  return null;
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less']}));
  app.use(express.cookieParser());
  app.use(express.session({secret:'u43jio34u8'}));
  app.dynamicHelpers({flash: function(req, res){return req.flash();}
                     ,user: function(req, res){return req.session.user;}
                     ,results: function(req, res){return req.results;}});
  app.helpers({title: 'Pigskin Picks'
              ,teamName: teamName
              ,entryForWeek: entryForWeek });
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function loadResults(req, res, next) {
  req.results = [];

  model.Week.where('has_been_scored').equals(true)
            .desc('number').count(function(weekErr, week) {
    if (!week) {
      next();
      return;
    }

    model.User.where('entries.week').equals(week)
              .run(function (err, users) {
      req.results = users;
      next();
    });
  });
}

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('error', 'You must be logged in to see that page');
    res.redirect('/login');
  }
}

function toAdmin(req, res, next) {
  if (req.session.user.is_admin) {
    next();
  } else {
    res.redirect('/');
  }
}

// Routes
app.get('/', loadResults, routes.index);

app.get('/user', loadResults, routes.user_new);
app.post('/user', loadResults, routes.user_create);

app.get('/login', loadResults, routes.login_form);
app.post('/login', loadResults, routes.login);

app.get('/logout', loadResults, routes.logout);

app.get('/picks', loadResults, restricted, routes.picks);
app.post('/picks', loadResults, routes.submit_picks);

app.get('/results', loadResults, routes.results);

app.get('/week', loadResults, restricted, toAdmin, routes.week_new);
app.post('/week', loadResults, restricted, toAdmin, routes.week_create);

app.get('/score', loadResults, restricted, toAdmin, routes.score_week);
app.post('/score', loadResults, restricted, toAdmin, routes.submit_scores);

app.use(function(req, res, next) {
  res.status(404);
  res.render('404', { layout : false });
});

mongoose.connect('mongodb://mafrauen:pigskin@staff.mongohq.com:10009/pigskinpicks');
app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
