module.exports = {
	name: 'create',
	description: 'Creates a raid at the usual times',
	execute(message, client, args) {
		const key = require('../../config.json')['api-key'];
		const axios = require('axios');

		function getNextDayOfWeek(date, dayOfWeek) {
			// Code to check that date and dayOfWeek are valid left as an exercise ;)

			const resultDate = new Date(date.getTime());

			resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

			return resultDate;
		}

		let date;
		let start_time = '19:30';
		let end_time = '22:30';
		let difficulty = 'Mythic';
		let successMsg = true;
		if (args.length == 0) {
			const monDate = getNextDayOfWeek(new Date(), 1);

			date = getNextDayOfWeek(monDate, 4).toISOString().split('T');
			const dateList = [];
			dateList.push(date[0]);
			date = getNextDayOfWeek(monDate, 7).toISOString().split('T');
			dateList.push(date[0]);

			axios.get('https://wowaudit.com/v1/raids', {
				headers: { 'Authorization': key },
			}).then(function(getResults) {
				for (let i = 0; i < dateList.length; i++) {
					for (let j = 0; j < getResults.data['raids'].length; j++) {
						if (dateList[i] == getResults.data['raids'][j]['date']) {
							dateList.splice(i, 1);
						}
					}
				}
				if (dateList.length == 0) {
					message.channel.send('Die Raids für nächste Woche wurden bereits erstellt.');
				}

				for(let j = 0; j < dateList.length; j++) {
					axios.post('https://wowaudit.com/v1/raids', {
						api_key: key,
						date: dateList[j],
						start_time: start_time,
						end_time: end_time,
						instance: 'Castle Nathria',
						difficulty: difficulty,
					}).then(function() {
						if (successMsg) {
							successMsg = false;
							message.channel.send('Die Raids wurden zu den üblichen Zeiten erstellt');
							client.channels.cache.get('736983487126700065').send('<@&239914390298558476> Die neuen Raids wurden jetzt erstellt, falls jemand keine Zeit hat oder verspätet kommt hier einschreiben: https://wowaudit.com/eu/aegwynn/too-late/main/raids/upcoming');
						}
					}).catch(function(error) {
						message.channel.send('Ein Fehler ist aufgetreten <@261536893089349632> ' + error);
					});
				}
			});
		}
		else {
			date = args[0];
			if (args[1] != undefined) { start_time = args[1]; }
			if (args[2] != undefined) { end_time = args[2]; }
			if (args[3] != undefined) { difficulty = args[3]; }

			axios.post('https://wowaudit.com/v1/raids', {
				api_key: key,
				date: date,
				start_time: start_time,
				end_time: end_time,
				instance: 'Castle Nathria',
				difficulty: difficulty,
			}).then(function() {
				if (successMsg) {
					successMsg = false;
					message.channel.send('(' + difficulty + ')' + 'Der Raid wurde am ' + date + ' von ' + start_time + ' bis ' + end_time + ' erstellt');
					client.channels.cache.get('736983487126700065').send('<@&239914390298558476> Es wurde ein neues Raidevent am ' + date + ' erstellt, falls jemand keine Zeit hat oder verspätet kommt hier einschreiben: https://wowaudit.com/eu/aegwynn/too-late/main/raids/upcoming');
				}
			}).catch(function(error) {
				message.channel.send('Ein Fehler ist aufgetreten <@261536893089349632> ' + error);
			});
		}
	},
};