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
    model.User.find({}).run(function(err, users) {
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
    console.log(err);
    if (user) {
      req.session.regenerate(function() {
        req.session.user = user;
        res.redirect('/');
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
