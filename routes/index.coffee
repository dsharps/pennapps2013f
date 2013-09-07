async = require 'async'
quest = require 'quest'
_ = require 'underscore'
app_id = "757d656f"
app_key = "b3d845556c1b281db28d32a605feac6b"
util = require 'util'
cheerio = require 'cheerio'
#
# * GET home page.
#
exports.index = (req, res) ->
  res.render "index"

exports.recipes = (req, res) ->
  query = req.query or {}
  query.maxResult = 100
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
    return res.send 400, {error: "No matches for query"} unless matches.length > 0

    # only return recipes from Food Republic
    recipes = _.filter matches, (match) ->
      return match.sourceDisplayName is 'Food Republic'

#    for match in recipes 
#      sources[match.sourceDisplayName] = 0 unless sources[match.sourceDisplayName]?
#      sources[match.sourceDisplayName]++
#    console.log sources
    res.type 'application/json'
    return res.send 400, {error: "No recipes found after filter"} unless recipes.length > 0
    if raw_queries.return_one?
      r = Math.floor(Math.random() * recipes.length)
      res.send recipes[r]
    else
      res.send recipes 

exports.retrieve_text = (req, res) ->
  return res.send 400, {error: "No recipe id provided"} unless req.query.id
  options =
    uri: "http://api.yummly.com/v1/api/recipe/#{req.query.id}"
    headers:
      "X-Yummly-App-ID": app_id
      "X-Yummly-App-Key": app_key
    json: true
  resp_obj = {}
  async.waterfall [
    (cb_wf) ->
      quest options, cb_wf
    (response, body, cb_wf) ->
      # yummly recipe entity
      resp_obj.name = body.name
      resp_obj.ingredients = body.ingredientLines
      options =
        uri: body.source.sourceRecipeUrl
      quest options, cb_wf
    (response, body, cb_wf) ->
      # actual recipe page
      $ = cheerio.load(body)
      steps = $('ol').children().text()
      steps = steps.replace /.\)/g, ').'
      sentences = ("#{sentence}." for sentence in steps.split('.'))
      resp_obj.text = sentences
      cb_wf()
  ], (err, sentences) ->
    return res.send 400, err if err?
    res.type 'application/json'
    res.send 200, resp_obj 
  



