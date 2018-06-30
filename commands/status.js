'use strict';

const https = require('https');
const URL = 'https://wrya.net/tmp/salien-status/';

function formattedTime(minutes) {
  let hours = 0;
  let minutesF = 0;
  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutesF = minutes % 60;
  }
  
  return [hours, minutesF]
}

function process(data, msg, args, bot) {
  let finalMsg = '';
  for (let i = 1; i <= 5; i++) {
    let planet = data.split('<div class=\"planet\">')[i];
    let title = planet.split('<tr>')[1].split('>')[1].split('<')[0];
    let progress = planet.split('<tr>')[3].split('>')[1].split('<')[0].slice(0, -1);
    let zonesEasy = [Number(planet.split('<tr>')[15].split('</td>')[0].split('<br>')[1].split('/')[0]), Number(planet.split('<tr>')[15].split('</td>')[0].split('<br>')[1].split('/')[1])];
    let zonesMedium = [Number(planet.split('<tr>')[15].split('</td>')[1].split('<br>')[1].split('/')[0]), Number(planet.split('<tr>')[15].split('</td>')[1].split('<br>')[1].split('/')[1])];
    let zonesHard = [Number(planet.split('<tr>')[15].split('</td>')[2].split('<br>')[1].split('/')[0]), Number(planet.split('<tr>')[15].split('</td>')[2].split('<br>')[1].split('/')[1])]  
    
    let minutes = (zonesEasy[1] - zonesEasy[0]) * 4 + (zonesMedium[1] - zonesMedium[0]) * 8 + (zonesHard[1] - zonesHard[0]) * 16;
    let time = formattedTime(minutes);
    
    progress = Number(Math.round(Number(progress)+'e2')+'e-2').toFixed(2);
    finalMsg += ':earth_americas:' + ' **' + title + ' ** || ' + ':hammer:' + ' *' + progress + '%* || :hourglass_flowing_sand:*ETA:* **' + time[0] + 'h ' + time[1] + 'm**\n:map: ';
    if (zonesHard[1] === zonesHard[0] && zonesMedium[1] === zonesMedium[0]) {
      finalMsg += `***${zonesEasy[1] - zonesEasy[0]} easy** tiles left!*\n`; 
    } else if (zonesHard[1] === zonesHard[0]) {
      finalMsg += `***${zonesMedium[1] - zonesMedium[0]} medium** tiles left!*\n`;
    } else {
      finalMsg += `***${zonesHard[1] - zonesHard[0]} hard** tiles left!*\n`
    }
  }
  
  if (bot.lastMessage) {
    console.log(Date.now() - bot.lastMessage.createdTimestamp);
    bot.lastMessage.delete();
  }
  
  msg.channel.send(finalMsg);
}

function getPlanetsStatus(URL, msg, args, bot) {
  https.get(URL, (res) => {
    let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => process(data, msg, args, bot));
  }).on('error', () => {}
  );
}

module.exports = {
  name: 'status',
  aliases: ['st'],
  description: 'Planet status!',
  execute(message, args, bot) {
    getPlanetsStatus(URL, message, args, bot);
    
  },
};