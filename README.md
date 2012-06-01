## Pigskin Picks Football Pool

What is it?
-----------
Recreating the pigskin picks website originally located [here][southslope_url]


What does it use?
-----------------
* node.js [site][url_node]
* express.js [site][url_express]
* mongoose.js [site][url_mongoose]
* cloud hosted mongodb [MongoHQ][url_mongo]
* css from [twitter bootstrap][url_bootstrap]


Where can I use it?
-------------------
The demo is available [here][url_heroku]



## Technical Details


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

### TODO

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
  * Rotation (may be bootstrap issue)
  * Tables are probably not best option for iPhone viewing



[url_node]: http://nodejs.org/
[url_express]: http://expressjs.com/
[url_mongoose]: http://mongoosejs.com/
[url_southslope]: http://www.southslope.net/~mattbenge/pigskin/  "Original Pick Site"
[url_mongohq]: http://www.mongohq.com
[url_bootstrap]: http://twitter.github.com/bootstrap
[url_heroku]: http://pigskinpicks.herokuapp.com