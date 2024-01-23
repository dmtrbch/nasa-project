const { getAllPlanets } = require('../../models/planets.model');

function httpGetAllPlanets(req, res) {
  // return isnt used by express
  // we just use it to make sure that our function stops executing
  // prevents bugs
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
}