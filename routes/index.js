
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

exports.picks = function(req, res){
  res.render('picks', { title: 'Express',
                        user: 'Mike',
                        games: games})
};
