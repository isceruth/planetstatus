'use strict';

const https = require('https');
const URL = 'https://wrya.net/tmp/salien-status/';

function process(data, msg, args) {
  let finalMsg = '';
  for (let i = 1; i <= 5; i++) {
    let planet = data.split('<div class=\"planet\">')[i];
    let title = planet.split('<tr>')[1].split('>')[1].split('<')[0];
    let progress = planet.split('<tr>')[3].split('>')[1].split('<')[0].slice(0, -1);
    let zonesEasy = [Number(planet.split('<tr>')[15].split('</td>')[0].split('<br>')[1].split('/')[0]), Number(planet.split('<tr>')[15].split('</td>')[0].split('<br>')[1].split('/')[1])];
    let zonesMedium = [Number(planet.split('<tr>')[15].split('</td>')[1].split('<br>')[1].split('/')[0]), Number(planet.split('<tr>')[15].split('</td>')[1].split('<br>')[1].split('/')[1])];
    let zonesHard = [Number(planet.split('<tr>')[15].split('</td>')[2].split('<br>')[1].split('/')[0]), Number(planet.split('<tr>')[15].split('</td>')[2].split('<br>')[1].split('/')[1])];
    
    let hours = 0;
    let minutes = (zonesEasy[1] - zonesEasy[0]) * 4 + (zonesMedium[1] - zonesMedium[0]) * 8 + (zonesHard[1] - zonesHard[0]) * 16;
    if (minutes >= 60) {
      hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    
    progress = Number(Math.round(Number(progress)+'e2')+'e-2').toFixed(2);
    finalMsg += ':earth_americas:' + ' **' + title + ' ** || ' + ':hammer:' + ' *' + progress + '%* || :hourglass_flowing_sand: *ETA:* **' + hours + 'h ' + minutes + 'm**\n';
    //if (zonesHard[1] === zonesHard[0] && zonesMedium[1] === zonesMedium[0]) {
    //  finalMsg += 'Only easy tiles left! **ETA** ' + eta + 'm\n'; 
    //}
  }
    msg.channel.send(finalMsg);
}

function getPlanetsStatus(URL, msg, args) {
  https.get(URL, (res) => {
    let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => process(data, msg, args));
  }).on('error', () => {}
  );
}

module.exports = {
  name: 'status',
  aliases: ['st'],
  description: 'Planet status!',
  execute(message, args) {
    getPlanetsStatus(URL, message, args);
    
  },
};