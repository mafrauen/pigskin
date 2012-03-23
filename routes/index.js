var model = require('../model')
   ,crypto = require('crypto');

exports.index = function(req, res){
  res.render('index',{});
};

function user_has_entry_for_week(user, week) {
  function entryIsForWeek(entry, i, a) {
    return entry.week*1 == week.number*1;
  }
  return user.entries.some(entryIsForWeek);
};

exports.picks = function(req, res){
  model.Week.findOne({}).desc('number').run(function(err, week) {
    if (user_has_entry_for_week(req.session.user, week)) {
      console.log('picked');
    };

    res.render('picks', { week: week })
  });
};

exports.results = function(req, res){
  model.Week.find({}).run(function (err, weeks) {
    model.User.find({}).desc('score_total').run(function(err, users) {
      res.render('results', { weeks: weeks,
                              users: users })
    });
  });
};

exports.submit_picks = function(req, res){
  model.User.findById(req.session.user._id, function(err, user) {
    var entry = req.body.entry;
    entry.score_result = 0;
    entry.score_tiebreaker = 0;
    user.entries.push(entry);
    user.save(function(err) {
      // TODO this may have errors for not enough picks
      if (err) console.log(err);
    });
  });
  res.redirect('back');
};

exports.score_week = function(req, res) {
  model.Week.findOne({}).desc('number').run(function(err, week) {
    res.render('score', { week: week });
  });
};

exports.submit_scores = function(req, res) {
  model.Week.findOne({}).desc('number').run(function(err, week) {
    var winningTeams = [];

    for (var i = 0; i< 10; i++) {
      var favScore = req.body.scores.favorite[i];
      var oppScore = req.body.scores.opponent[i];
      var spread = week.games[i].spread;

      if (favScore > oppScore + spread) {
        winningTeams.push(week.games[i].team_favorite);
      } else if (favScore < oppScore + spread) {
        winningTeams.push(week.games[i].team_opponent);
      }
    }

    week.has_been_scored = true;
    week.save(function(err) {});

    model.User.where('entries.week').equals(week.number).run(function (err, users) {
      for (var j = 0; j < users.length; j++) {
        var user = users[j];

        var userEntry = getUserEntry(user, week.number);
        console.log('entry = ' + userEntry);
        var week_score = getIntersect(winningTeams, userEntry.teams).length;
        console.log('score = ' + week_score);
        userEntry.score_result = week_score;
        user.score_total += week_score;
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
exports.user_new = function(req, res) {
  res.render('user');
}

function hash(pass) {
  var key = 'pigpicks';
  return crypto.createHmac('sha256', key).update(pass).digest('hex');
}

// POST new user
exports.user_create = function(req, res) {
  var newUser = new model.User(req.body.user);
  newUser.password = hash(req.body.user.password);
  newUser.score_total = 0;
  newUser.is_admin = false;
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
exports.week_new = function(req, res) {
  model.Week.count({}, function(err, size) {
    res.render('week', { week_size: size });
  });
}

// POST new week
exports.week_create = function(req, res) {
  var week = new model.Week();
  var number = req.body.week.number;
  week._id = '2012_'+number;
  week.number = number;

  for (var i = 0; i< 10; i++) {
    var game = {};
    game.team_favorite = req.body.week.team_favorite[i];
    game.team_opponent = req.body.week.team_opponent[i];
    game.spread = req.body.week.spread[i];
    game.is_favorite_home = req.body.week.home_team.indexOf((i+1).toString()) >= 0;
    week.games.push(game);
  }

  week.tiebreaker_favorite = req.body.week.tiebreaker_favorite;
  week.tiebreaker_opponent = req.body.week.tiebreaker_opponent;
  week.tiebreaker_spread = req.body.week.tiebreaker_spread;
  week.tiebreaker_home_favorite = req.body.week.tiebreaker_home_favorite;

  week.save(function(err) {});

  res.redirect('back');
}

// GET login form
exports.login_form = function(req, res) {
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
