var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var GameSchema = new Schema({
    team_favorite : String
  , team_opponent : String
  , spread : Number
  , is_favorite_home : Boolean
});
var Game = mongoose.model('Game', GameSchema)

var WeekSchema = new Schema({
    _id : String // Year/Week, ex. 2012_1
  , number : Number
  , games : [GameSchema]
  , tiebreaker_favorite : String
  , tiebreaker_opponent : String
  , tiebreaker_spread : Number
  , tiebreaker_home_favorite : Boolean
});
var Week = mongoose.model('Week', WeekSchema)

var EntrySchema = new Schema({
    week : Number
  , teams : [String]
  , tiebreaker_favorite : Number
  , tiebreaker_opponent : Number
  , score_result : Number
  , score_tiebreaker : Number
});
var Entry = mongoose.model('Entry', EntrySchema)

var UserSchema = new Schema({
    _id : String //username
  , full_name : String
  , entries : [EntrySchema]
  , score_total : Number
  , is_admin : Boolean
});
var User = mongoose.model('User', UserSchema)

mongoose.connect('mongodb://mafrauen:pigskin@staff.mongohq.com:10009/pigskinpicks')

exports.index = function(req, res){
  res.render('index', { title: 'Pigskin Picks' })
};

function user_has_entry_for_week(user, week) {
  function entryIsForWeek(entry, i, a) {
    return entry.week*1 == week.number*1;
  }
  return user.entries.some(entryIsForWeek);
}

exports.picks = function(req, res){
  // TODO get logged in user
  User.findOne({full_name:'Michael Frauenholtz'}, function(err, user) {
    Week.findOne({}).desc('number').run(function(err, week) {
      if (user_has_entry_for_week(user, week)) {
        console.log('picked');
      };

      res.render('picks', { title: 'Pigskin Picks',
                            user: user,
                            week: week })
    });
  });
};

exports.results = function(req, res){
  res.render('results', { title: 'Pigskin Picks',
                          weeks: weeks,
                          users: users })
};

exports.submit_picks = function(req, res){
  // TODO get logged in user
  User.findOne({full_name:'Michael Frauenholtz'}, function(err, user) {
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

exports.new_user = function(req, res) {
  var user = new User();
  user._id = 'mafrauen';
  user.full_name = 'Michael Frauenholtz';
  user.score_total = 0;
  user.save(function(err) { if (err) console.log(err); });
  res.redirect('/');
}

// GET new week
exports.week_new = function(req, res) {
  // TODO Validate that logged in user is an admin
  Week.count({}, function(err, size) {
    res.render('week', { title: 'Pigskin Picks',
                         week_size: size });
  });
}

// POST new week
exports.week_create = function(req, res) {
  var week = new Week();
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
