var model = require('../model')
   ,crypto = require('crypto');

exports.index = function(req, res){
  res.render('index',{});
};

function userHasEntryForWeek(user, week) {
  function entryIsForWeek(entry, i, a) {
    return entry.week*1 == week.number*1;
  }
  return user.entries.some(entryIsForWeek);
};

exports.picks = function(req, res){
  model.Week.findOne({}).desc('number').run(function(err, week) {
    if (userHasEntryForWeek(req.session.user, week)) {
      console.log('picked');
    };

    if (week) {
      res.render('picks', { week: week })
    } else {
      req.flash('error', 'No games are available to pick yet. Check back later.');
      res.redirect('/');
    }
  });
};

exports.results = function(req, res){
  model.Week.find({}).run(function (err, weeks) {
    model.User.find({}).desc('scoreTotal').run(function(err, users) {
      res.render('results', { weeks: weeks,
                              users: users })
    });
  });
};

exports.submitPicks = function(req, res){
  model.User.findById(req.session.user._id, function(err, user) {
    var entry = req.body.entry;
    entry.scoreResult = 0;
    entry.scoreTiebreaker = 0;
    user.entries.push(entry);
    user.save(function(err) {
      // TODO this may have errors for not enough picks
      if (err) console.log(err);

      req.session.regenerate(function() {
        req.session.user = user;
        res.redirect('back');
      });
    });
  });
};

exports.scoreWeek = function(req, res) {
  model.Week.findOne({}).desc('number').run(function(err, week) {
    res.render('score', { week: week });
  });
};

exports.submitScores = function(req, res) {
  model.Week.findOne({}).desc('number').run(function(err, week) {
    var winningTeams = [];

    for (var i = 0; i< 10; i++) {
      var favScore = req.body.scores.favorite[i];
      var oppScore = req.body.scores.opponent[i];
      var spread = week.games[i].spread;

      if (favScore > oppScore + spread) {
        winningTeams.push(week.games[i].teamFavorite);
      } else if (favScore < oppScore + spread) {
        winningTeams.push(week.games[i].teamOpponent);
      }
    }

    week.hasBeenScored = true;
    week.save(function(err) {});

    model.User.where('entries.week').equals(week.number).run(function (err, users) {
      for (var j = 0; j < users.length; j++) {
        var user = users[j];

        var userEntry = getUserEntry(user, week.number);
        console.log('entry = ' + userEntry);
        var weekScore = getIntersect(winningTeams, userEntry.teams).length;
        console.log('score = ' + weekScore);
        userEntry.scoreResult = weekScore;
        user.scoreTotal += weekScore;
        user.save(function(err) {});
      }

      res.redirect('results');
    });
  });
}

var getUserEntry = function(user, week) {
  for (var i = 0; i < user.entries.length; i++) {
    if (user.entries[i].week*1 === week*1) return user.entries[i];
  }
  return null;
}
exports.getUserEntry = getUserEntry;

function getIntersect(arr1, arr2) {
  var r = [], o = {}, l = arr2.length, i, v;
  for (i = 0; i < l; i++) {
    o[arr2[i]] = true;
  }
  l = arr1.length;
  for (i = 0; i < l; i++) {
    v = arr1[i];
    if (v in o) {
      r.push(v);
    }
  }
  return r;
}

// GET new user
exports.userNew = function(req, res) {
  res.render('user');
}

function hash(pass) {
  var key = 'pigpicks';
  return crypto.createHmac('sha256', key).update(pass).digest('hex');
}

// POST new user
exports.userCreate = function(req, res) {
  var newUser = new model.User(req.body.user);
  newUser.password = hash(req.body.user.password);
  newUser.scoreTotal = 0;
  newUser.isAdmin = false;
  newUser.save(function(err) {
    //TODO possible same username
    if (err) {
      res.flash('error', err);
      res.redirect('back');
      return;
    }
    req.session.regenerate(function() {
      req.session.user = newUser;
      res.redirect('/');
    });
  });
}

// GET new week
exports.weekNew = function(req, res) {
  model.Week.count({}, function(err, size) {
    res.render('week', { weekSize: size });
  });
}

// POST new week
exports.weekCreate = function(req, res) {
  var week = new model.Week();
  var number = req.body.week.number;
  week._id = '2012_'+number;
  week.number = number;

  for (var i = 0; i< 10; i++) {
    var game = {};
    game.teamFavorite = req.body.week.teamFavorite[i];
    game.teamOpponent = req.body.week.teamOpponent[i];
    game.spread = req.body.week.spread[i];
    game.isFavoriteHome = req.body.week.homeTeam.indexOf((i+1).toString()) >= 0;
    week.games.push(game);
  }

  week.tiebreakerFavorite = req.body.week.tiebreakerFavorite;
  week.tiebreakerOpponent = req.body.week.tiebreakerOpponent;
  week.tiebreakerSpread = req.body.week.tiebreakerSpread;
  week.tiebreakerHomeFavorite = req.body.week.tiebreakerHomeFavorite;

  week.save(function(err) {});

  res.redirect('back');
}

// GET login form
exports.loginForm = function(req, res) {
  res.render('login');
}

// POST to login page
exports.login = function(req, res) {
  model.User.findOne({_id: req.body.user._id, password: hash(req.body.user.password)}, function(err, user) {
    if (user) {
      req.session.regenerate(function() {
        req.session.user = user;
        res.redirect('/picks');
      });
    } else {
      req.flash('error', 'Invalid username/password');
      res.redirect('back');
    }
  });
}

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  });
}
