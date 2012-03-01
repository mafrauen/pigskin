
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

var games = [
{
  favorite: "Iowa",
  opponent: "Nebraska",
  spread: 9.5,
  home_favorite: true
},
{
  favorite: "Alabama",
  opponent: "LSU",
  spread: 1,
  home_favorite: true
}];
var tiebreaker =
{
  favorite: "Oregon",
  opponent: "Stanford",
  spread: 151,
  home_favorite: false
}

exports.picks = function(req, res){
  res.render('picks', { title: 'Express',
                        user: 'Mike',
                        games: games,
                        tiebreaker: tiebreaker })
};


var results = [
{
  user: "Mike",
  correct: 9,
  tiebreaker: 10
},
{
  user: "Dad",
  correct: 8,
  tiebreaker: 15
}
]

exports.results = function(req, res){
  res.render('results', { title: 'Express',
                          results: results })
};
