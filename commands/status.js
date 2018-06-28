'use strict';

const https = require('https');
const URL = 'https://wrya.net/tmp/salien-status/';

function process(data, msg, args) {
  for (let i = 1; i <= 5; i++) {
    let planet = data.split('<div class=\"planet\">')[i];
    let title = planet.split('<tr>')[1].split('>')[1].split('<')[0];
    let progress = planet.split('<tr>')[3].split('>')[1].split('<')[0].slice(0, -1);
    let zonesTotal = planet.split('<tr>')[5].split('(')[1].split(')')[0];
    //let zonesEasy = planet.split('<tr>')[15].split('</td>')[0].split('<br>')[1];
    let zonesMedium = planet.split('<tr>')[15].split('</td>')[1].split('<br>')[1];
    let zonesHard = planet.split('<tr>')[15].split('</td>')[2].split('<br>')[1];
    progress = Number(Math.round(Number(progress)+'e2')+'e-2').toFixed(2);
    let reversePlStMsg = '**PROGRESS**' + ' *' + progress + '%* || **NAME**' + ' *' + title + '*\n' + '**COMPLETED**' + ' *' + zonesTotal + '*  (**HARD**' + ' *' + zonesHard + '*)'; 
    
    //let planetStatusMessage = '**Name:** *' + title.substring(0, 15) + '* || **current progress:** *' + progress + '*'; 
    msg.channel.send(reversePlStMsg);
  }
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