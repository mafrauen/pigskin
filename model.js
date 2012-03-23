var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var GameSchema = new Schema({
    team_favorite : String
  , team_opponent : String
  , spread : Number
  , is_favorite_home : Boolean
});
exports.Game = mongoose.model('Game', GameSchema)

var WeekSchema = new Schema({
    _id : String // Year/Week, ex. 2012_1
  , number : Number
  , has_been_scored : Boolean
  , games : [GameSchema]
  , tiebreaker_favorite : String
  , tiebreaker_opponent : String
  , tiebreaker_spread : Number
  , tiebreaker_home_favorite : Boolean
});
exports.Week = mongoose.model('Week', WeekSchema)

var EntrySchema = new Schema({
    week : Number
  , teams : [String]
  , tiebreaker_favorite : Number
  , tiebreaker_opponent : Number
  , score_result : Number
  , score_tiebreaker : Number
});
exports.Entry = mongoose.model('Entry', EntrySchema)

var UserSchema = new Schema({
    _id : String //username
  , password : String
  , full_name : String
  , entries : [EntrySchema]
  , score_total : Number
  , is_admin : Boolean
});
exports.User = mongoose.model('User', UserSchema)
