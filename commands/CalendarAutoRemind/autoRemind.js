module.exports = {
	name: 'remind',
	description: 'Auto reminds the raiders at 10pm every tuesday if any raid invites are happening and hands them a link to confirm attendance',
	execute(client) {
		const key = require('../../config.json')['api-key'];
		const axios = require('axios');
		axios.get('https://wowaudit.com/v1/raids', {
			headers: { 'Authorization': key },
		}).then(function(getResults) {
			for (let i = 0; i < getResults.data['raids'].length; i++) {
				if (getResults.data['raids'][i]['status'] == 'Planned') {
					client.channels.cache.get('736983487126700065').send('!Reminder! <@&239914390298558476> falls jemand keine Zeit hat oder verspätet kommt hier einschreiben: https://wowaudit.com/eu/aegwynn/too-late/main/raids/upcoming');
					break;
				}
			}
		});

	},
};