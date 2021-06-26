module.exports = {
	name: 'notify',
	description: 'DMs everyone whose assigned for raid',
	execute(message, client, args) {
		const key = require('../../config.json')['api-key'];
		const axios = require('axios');
		const raiderIDs = require('./raiderIDs.json');

		if (args.length == 0) {
			message.channel.send('Bitte gib die RaidID aus der URL zum Command hinzu');
		}
		else {
			axios.get('https://wowaudit.com/v1/raids/' + args[0], {
				headers: { 'Authorization': key },
			}).then(function(raidResults) {
				for (let j = 0; j < raidResults.data.signups.length; j++) {
					if(raidResults.data.signups[j].status == 'Present') {
						client.users.cache.get(raiderIDs[raidResults.data.signups[j].character.name]).send('[Automated Message] Du bist heute für den Raid geplant, hier ist nochmal der Kader zu sehen https://wowaudit.com/eu/aegwynn/too-late/main/raids/' + args[0]);
					}
				}
				message.channel.send('Die Notifications wurden mit Expresslieferung versandt');
			});
		}
	},
};