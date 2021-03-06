async = require 'async'
quest = require 'quest'
_ = require 'underscore'
app_id = "757d656f"
app_key = "b3d845556c1b281db28d32a605feac6b"
util = require 'util'
cheerio = require 'cheerio'
MAX_RECIPES = 25 
NODE_ENV = process.env.NODE_ENV or 'production'
#
# * GET home page.
#
exports.index = (req, res) ->
  res.render "index"

exports.recipes = (req, res) ->
  get_recipes req.queries, MAX_RECIPES, (recipes) ->
#    for match in recipes 
#      sources[match.sourceDisplayName] = 0 unless sources[match.sourceDisplayName]?
#      sources[match.sourceDisplayName]++
#    console.log sources
    res.type 'application/json'
    return res.send 400, {error: "No recipes found after filter"} unless recipes.length > 0
    if req.query.return_one?
      r = Math.floor(Math.random() * recipes.length)
      res.send recipes[r]
    else
      res.send recipes 

exports.retrieve_text = (req, res) ->
  console.log arguments
  return res.send 400, {error: "No recipe id provided"} unless req.query.id
  get_text req.query.id, (err, resp_body) ->
    if err?
      console.log err
      return res.send 400, err
    res.type 'application/json'
    res.send 200, resp_obj 

exports.random = (req, res) ->
  get_recipes req.query, MAX_RECIPES, (err, recipes) ->
    #return res.send 400, err if err?
    if err?
      console.log 'err', err
      return res.send 400, err
    r = Math.floor(Math.random() * recipes.length)
    id = recipes[r].id
    get_text id, (err, resp_obj) ->
      if err?
        console.log err
        return res.send 400, err
      res.type 'application/json'
      console.log util.inspect resp_obj
      res.send 200, resp_obj 

get_text = (id, cb) ->
  options =
    uri: "http://api.yummly.com/v1/api/recipe/#{id}"
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
      ingredients = body.ingredientLines
      truncated = []
      for line in ingredients
        i = line.indexOf(',') 
        if i > 0 then truncated.push line.substr(0, i) else truncated.push line
      resp_obj.name = body.name
      resp_obj.ingredients = truncated
      options =
        uri: body.source.sourceRecipeUrl
      quest options, cb_wf
    (response, body, cb_wf) ->
      # actual recipe page
      $ = cheerio.load(body)
      steps = $('ol').children().text()
      #steps = steps.replace /.\)/g, ').'
      sentences = ("#{sentence}." for sentence in steps.split('.'))
      resp_obj.text = sentences 
      cb_wf null, resp_obj
  ], cb 


get_recipes = (queries, n, cb) ->
  query = queries or {}
  query.maxResult = n 
  query['excludedCourse[]']='course^course-Condiments'
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
  console.log options.uri
  console.log options.qs 
  quest options, (err, resp, body) ->
    if err? or resp.code >= 400
      console.log "Error code #{resp.code}:", err
      return cb {error: err}
    return cb {error: "No matches for query options: #{util.inspect options.qs}"} unless body.matches
    matches = body.matches
    console.log "#{matches.length} matches"
    return cb {error: "No matches for query"} unless matches.length > 0
    # only keep recipes from Food Republic
    recipes = _.filter matches, (match) ->
      return match.sourceDisplayName is 'Food Republic'
    return cb null, recipes



