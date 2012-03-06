var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Game = new Schema({
    team_favorite : String
  , team_opponent : String
  , spread : Number
  , is_favorite_home : Boolean
});

var Week = new Schema({
    number : Number
  , games : [Game]
  , tiebreaker_favorite : String
  , tiebreaker_opponent : String
  , tiebreaker_spread : Number
  , tiebreaker_home_favorite : Boolean
});

var Entry = new Schema({
    week : Number
  , teams : [String]
  , tiebreaker_favorite : Number
  , tiebreaker_opponent : Number
  , score_result : Number
  , score_tiebreaker : Number
});

var User = new Schema({
    _id : String //username
  , full_name : String
  , entries : [Entry]
  , score_total : Number
});

mongoose.connect('mongodb://mafrauen:pigskin@staff.mongohq.com:10009/pigskinpicks')
var games = mongoose.model('Game', Game)
var weeks = mongoose.model('Week', Week)
var entries = mongoose.model('Entry', Entry)
var users = mongoose.model('User', User)

exports.index = function(req, res){
  res.render('index', { title: 'Pigskin Picks' })
};

exports.picks = function(req, res){
  users.findOne({full_name:'Michael Frauenholtz'}, function(err, doc) {
    weeks.find({}).desc('number').limit(1).run(function(err, week_docs) {
      console.log(week_docs);
      res.render('picks', { title: 'Pigskin Picks',
                            user: doc,
                            week: week_docs[0] })
    });
  });
};

exports.results = function(req, res){
  res.render('results', { title: 'Pigskin Picks',
                          weeks: weeks,
                          users: users })
};

exports.submit_picks = function(req, res){
  mongoose.model('User').findOne({full_name:'Michael Frauenholtz'}, function(err, user) {
    var entry = req.body.entry;
    entry.score_result = 0;
    entry.score_tiebreaker = 0;
    user.entries.push(entry);
    user.save(function(err) {
      if (err) console.log(err);
    });
  });
  res.redirect('back');
};

// GET new week
exports.week_new = function(req, res) {
  weeks.count({}, function(err, size) {
    res.render('week', { title: 'Pigskin Picks',
                         week_size: size });
  });
}

// POST new week
exports.week_create = function(req, res) {
  var week = new weeks();
  week.number = req.body.week.number;

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
