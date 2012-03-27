var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var GameSchema = new Schema({
    teamFavorite : String
  , teamOpponent : String
  , spread : Number
  , isFavoriteHome : Boolean
});
exports.Game = mongoose.model('Game', GameSchema)

var WeekSchema = new Schema({
    _id : String // Year/Week, ex. 2012_1
  , number : Number
  , hasBeenScored : Boolean
  , games : [GameSchema]
  , tiebreakerFavorite : String
  , tiebreakerOpponent : String
  , tiebreakerSpread : Number
  , tiebreakerHomeFavorite : Boolean
});
exports.Week = mongoose.model('Week', WeekSchema)

var EntrySchema = new Schema({
    week : Number
  , teams : [String]
  , tiebreakerFavorite : Number
  , tiebreakerOpponent : Number
  , scoreResult : Number
  , scoreTiebreaker : Number
});
exports.Entry = mongoose.model('Entry', EntrySchema)

var UserSchema = new Schema({
    _id : String //username
  , password : String
  , fullName : String
  , entries : [EntrySchema]
  , scoreTotal : Number
  , isAdmin : Boolean
});
exports.User = mongoose.model('User', UserSchema)
