Recreating the pigskin picks website originally located [here][southslope_url]

Using node.js and express.js.
Using mongoose.js for data modeling, hosting data on [MongoHQ][mongohq_url].
Initial css is from [twitter bootstrap][bootstrap_url].

Page will be hosted [here][heroku_url] during development, and possibly for production as well.



[southslope_url]: http://www.southslope.net/~mattbenge/pigskin/  "Original Pick Site"
[mongohq_url]: http://www.mongohq.com
[bootstrap_url]: http://twitter.github.com/bootstrap
[heroku_url]: http://pigskinpicks.herokuapp.com


# TODO

* 404 page
* What to do when viewing Picks page if already submitted
* View existing picks as PDF / Better way to show submitted picks for the week
* View game results (scores, covers, etc.) for all weeks
* Change how picking works (buttons/radios/else?)
* Result order, sort by column
* Make sure can't submit picks unless all items picked and tiebreaker entered
  * -> model validation or javascript to enable button?
* Results sidebar - view: make sure correct entry is shown
  * Make sure user can't submit after scores are submitted for the week
* When going to login page, make sure focus is on text input
* Make sure picks only count if submitted before games
* iOS
  * Make sure text fields are shortened to fit (eg login page)
  * Rotation (may be bootstrap issue)
  * Put brand name back on left side of nav
* Should usernames be case sensitive?

Pages
-----

* Nav bar
  * link to login/create new user
* Side bar
  * results from last week
* Results
  * everybody's results by week
  * everybody's results YTD
  * make sure user's results are easy to find
* Make picks
  * enter picks for the week
  * can only enter for current week
  * if already entered for week, redirect to results/show picks for the week
* Login
  * Username
  * Full name
  * password...


Models
------

* User
  * Full Name
  * username
  * password
  * Week
     * Week ID (needed to show right/wrong picks. would be linked not embedded. still ok?)
     * Picked Teams
     * Favorite Tiebreaker
     * Opponent Tiebreaker
     * Result Score
     * Tiebreaker Score
  * Total Score

* Week
  * Number (unique id, will reset each season)
  * Date of games
  * Games
     * Home Team
     * Away Team
     * Spread
     * Home Favorite
  * Tiebreaker (game)

Queries I'll Need
-----------------
    top 3(or more) winners for the week : Users(all).week(7).sort(score -1, tb 1).limit(3)
