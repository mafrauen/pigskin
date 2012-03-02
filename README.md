Recreating the pigskin picks website originally located [here][southslope_url]. Putting a modern face on football betting.

Using node.js and express.js.
Likely going to use MongoDB/Mongoose for modeling. Database hosted on MongoHQ.
Likely going to use twitter bootstrap for initial css/less.


Page will be hosted [here][heroku_url] during development, and possibly for production as well.



[southslope_url]: http://www.southslope.net/~mattbenge/pigskin/  "Original Pick Site"
[heroku_url]: http://pigskinpicks.herokuapp.com


# TODO

Pages
-----

* Home
  * results from last week
  * link to login/create new user
* Results
  * everybody's results by week
  * everybody's results YTD
  * make sure user's results are easy to find
* Make picks
  * enter picks for the week
  * can only enter for current week
  * if already entered for week, redirect to results/show picks for the week


Models
------

* User
  * Full Name
  * username
  * password?
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


### Previous Thoughts

* User
  * Week
    * Teams
    * Favorite Score
    * Opponent Score
    * Score
    * Tiebreaker Score

* Week
  * Games
     * Home Team
     * Away Team
     * Spread
     * Is Home Team Favorite
     * Home Score
     * Away Score
  * Tiebreaker (game)
  * User
    * Teams
    * Favorite Score
    * Opponent Score
    * Score
    * Tiebreaker Score

* User
  * Week
    * Teams
    * Favorite Score
    * Opponent Score
    * Score
    * Tiebreaker Score

* Results
  * User
    * Week
      * Correct
      * Tiebreaker
    * Total YTD correct


#### Queries I'll Need
    top 3(or more) winners for the week : Users(all).week(7).sort(score -1, tb 1).limit(3)
