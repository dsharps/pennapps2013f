quest = require 'quest'
qs = require 'qs'
_ = require 'underscore'
app_id = "757d656f"
app_key = "b3d845556c1b281db28d32a605feac6b"
util = require 'util'
#
# * GET home page.
#
exports.index = (req, res) ->
  res.render "index",
    title: "Welcome!"

exports.recipes = (req, res) ->
  query = req.query or {}
  query.maxResult = 1000
  raw_queries = {}
  # extract raw queries: allowedIngredient[]=pork -> allowedIngredient=['pork'] -> allowedIngredient[]=pork
  for k, v of query
    if _.isArray v 
      return res.send {error: "Expected one-element array. Got #{util.inspect v}"} if v.length isnt 1
      raw_queries[k + "[]"] = v[0]
    else
      raw_queries[k] = v


  options =
    uri: "http://api.yummly.com/v1/api/recipes"
    qs: raw_queries if raw_queries?
    headers:
      "X-Yummly-App-ID": app_id
      "X-Yummly-App-Key": app_key
    json: true
  sources = {}
  quest options, (err, resp, body) ->
    matches = body.matches
    console.log "#{matches.length} matches"
    return res.send {error: "No matches for query"} unless matches.length > 0

    # only return recipes from Food Republic
    recipes = _.filter matches, (match) ->
      console.log match
      return match.sourceDisplayName is 'Food Republic'

    # TODO: lots of scraping
    for match in recipes 
      sources[match.sourceDisplayName] = 0 unless sources[match.sourceDisplayName]?
      sources[match.sourceDisplayName]++
    console.log sources
    res.type 'application/json'
    res.send recipes 


