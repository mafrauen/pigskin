
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Pigskin Picks' })
};

exports.picks = function(req, res){
  res.render('picks', { title: 'Pigskin Picks',
                        user: users[0],
                        week: weeks[0] })
};

exports.results = function(req, res){
  res.render('results', { title: 'Pigskin Picks',
                          weeks: weeks,
                          users: users })
};

var users =[
{
  full_name: "Michael Frauenholtz",
  username: "mafrauen",
  entries: [
    {
      week: 1,
      teams: ["Nebraska","LSU","Purdue"],
      tiebreaker_favorite: 30,
      tiebreaker_opponent: 24,
      score_result: 3,
      score_tiebreaker: 12
    },
    {
      week: 2,
      teams: ["Wisconsin","Nebraska","Minnesota"],
      tiebreaker_favorite: 42,
      tiebreaker_opponent: 27,
      score_result: 1,
      score_tiebreaker: 18
    }],
  score_total: 17
},
{
  full_name: "Amber Buchan",
  username: "buchan186",
  entries: [
    {
      week: 1,
      teams: ["Iowa","Arkansas","Purdue"],
      tiebreaker_favorite: 28,
      tiebreaker_opponent: 21,
      score_result: 1,
      score_tiebreaker: 5
    },
    {
      week: 2,
      teams: ["Wisconsin","Michigan","Northwestern"],
      tiebreaker_favorite: 35,
      tiebreaker_opponent: 38,
      score_result: 1,
      score_tiebreaker: 0
    }],
  score_total: 17
}]

var weeks = [
{
  number: 1,
  games: [
    {
      team_favorite: "Nebraska",
      team_opponent: "Iowa",
      spread: 9.5,
      is_favorite_home: true
    },
    {
      team_favorite: "LSU",
      team_opponent: "Arkansas",
      spread: 13,
      is_favorite_home: true
    },
    {
      team_favorite: "Purdue",
      team_opponent: "Indiana",
      spread: 7.5,
      is_favorite_home: false
    }],
  tiebreaker:
    {
      team_favorite: "Stanford",
      team_opponent: "Notre Dame",
      spread: 7,
      is_favorite_home: true
    }
},
{
  number: 2,
  games: [
    {
      team_favorite: "Wisconsin",
      team_opponent: "Illinois",
      spread: 14,
      is_favorite_home: false
    },
    {
      team_favorite: "Michigan",
      team_opponent: "Nebraska",
      spread: 3,
      is_favorite_home: true
    },
    {
      team_favorite: "Northwestern",
      team_opponent: "Minnesota",
      spread: 16.5,
      is_favorite_home: true
    }],
  tiebreaker:
    {
      team_favorite: "Oregon",
      team_opponent: "USC",
      spread: 15,
      is_favorite_home: true
    }
}]
