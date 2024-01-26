const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const habitablePlantes = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6;
}

/**
 * We need this data to be avaliable when the server starts running
 * in order to populate the planets data, createReadStream is async, but
 * module.exports does not wait for it
 * const promise = new Promise((resolve, reject) => {
 *    resolve(42);
 * })
 * promise.then((result) => {
 *    
 * });
 * const result = await promise;
 * console.log(result);
 * 
 * we can use stream/promises instead of this
 */

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment:'#',
        columns: true,
      }))
      .on('data', async (data) => {
        if(isHabitablePlanet(data)) {
          await planets.create({
            keplerName: data.kepler_name,
          });
        }
          habitablePlantes.push(data);
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        console.log(`${habitablePlantes.length} habitable planets found!`);
        resolve();
      });
  });
}

function getAllPlanets() {
  return habitablePlantes;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
}