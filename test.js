'use strict';

const https = require('https');
const URL = 'https://wrya.net/tmp/salien-status/';

function process(data) {
  for (let i = 1; i <= 5; i++) {
    let planet = data.split('<div class=\"planet\">')[i];
    let title = planet.split('<tr>')[1].split('>')[1].split('<')[0];
    let progress = planet.split('<tr>')[3].split('>')[1].split('<')[0];
    let zonesTotal = planet.split('<tr>')[5].split('(')[1].split(')')[0];
    let zonesEasy = planet.split('<tr>')[15].split('</td>')[0].split('<br>')[1];
    let zonesMedium = planet.split('<tr>')[15].split('</td>')[1].split('<br>')[1];
    let zonesHard = planet.split('<tr>')[15].split('</td>')[2].split('<br>')[1];
  }
}

function getPlanetsStatus(URL) {
  https.get(URL, (res) => {
    let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => process(data));
  }).on('error', () => {}
  );
}

getPlanetsStatus(URL);