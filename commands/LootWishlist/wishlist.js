module.exports = {
	name: 'lootlist',
	description: 'Show the wishlist for everyone for the selected boss (1-??)',
	execute(message, client, arg) {
		const key = require('../../config.json')['api-key'];
		const axios = require('axios');
		const bossloot = require('./bossloot.json');
		let bossName = '';

		function isInt(value) {
			return !isNaN(value) &&
					parseInt(Number(value)) == value &&
					!isNaN(parseInt(value, 10));
		}

		if (isInt(arg[0])) {
			// id to bossName (1 => Shriekwing)
			switch (arg[0]) {
			case '0':
				bossName = 'Zone';
				break;
			case '1':
				bossName = 'The Tarragrue';
				break;
			case '2':
				bossName = 'The Eye of the Jailer';
				break;
			case '3':
				bossName = 'The Nine';
				break;
			case '4':
				// eslint-disable-next-line quotes
				bossName = `Remnant of Ner'zhul`;
				break;
			case '5':
				bossName = 'Soulrender Dormazain';
				break;
			case '6':
				bossName = 'Painsmith Raznal';
				break;
			case '7':
				bossName = 'Guardian of the First Ones';
				break;
			case '8':
				bossName = 'Fatescribe Roh-Kalo';
				break;
			case 9:
				// eslint-disable-next-line quotes
				bossName = `Kel'Thuzad`;
				break;
			case 10:
				bossName = 'Sylvanas Windrunner';
				break;
			}
		}
		else {
			for (let i = 0; i < Object.keys(bossloot).length; i++) {
				if (bossloot[Object.keys(bossloot)[i]].includes(arg.join(' '))) {
					console.log(Object.keys(bossloot)[i]);
					bossName = Object.keys(bossloot)[i];
				}
			}
		}

		const everyWish = [];
		const items = [];
		const indexList = [];
		let preparedMessage = '';
		let hugeMessage = '';
		let majorMessage = '';
		let minorMessage = '';
		let offspecMessage = '';

		axios.get('https://wowaudit.com/v1/wishlists', {
			headers: { 'Authorization': key },
		}).then(function(getResults) {
			if (bossName != '') {
				for(let i = 0; i < getResults.data['wishlists'].length; i++) {
					for(let j = 0; j < getResults.data['wishlists'][i]['items'].length;j++) {
						if (getResults.data['wishlists'][i]['items'][j]['encounter'] == bossName) {
							everyWish.push(getResults.data['wishlists'][i]['character']['name'] + ' - ' + getResults.data['wishlists'][i]['items'][j]['name'] + ' - ' + getResults.data['wishlists'][i]['items'][j]['upgrade_level']);
						}
					}
				}

				if (everyWish.length != 0) {
					for (let i = 0; i < everyWish.length; i++) {
						if (typeof items[everyWish[i].split(' - ')[1]] === 'undefined') {
							items[everyWish[i].split(' - ')[1]] = everyWish[i].split('-')[0] + '_' + everyWish[i].split('-')[2] + ' - ';
							indexList.push(everyWish[i].split(' - ')[1]);
						}
						else {
							items[everyWish[i].split(' - ')[1]] += everyWish[i].split('-')[0] + '_' + everyWish[i].split('-')[2] + ' - ';
						}
					}

					for (let i = 0; i < Object.keys(items).length; i++) {
						if (isInt(arg[0])) {
							// eslint-disable-next-line quotes
							preparedMessage = "```" + Object.keys(items)[i] + '\n';
							hugeMessage = '- Prio: 1\n';
							majorMessage = '- Prio: 2\n';
							minorMessage = '- Prio: 3\n';
							offspecMessage = '- Prio: 4\n';
							for (let j = 0; j < items[indexList[i]].split(' - ').length; j++) {
								switch (items[indexList[i]].split(' - ')[j].split(' _ ')[1]) {
								case 'Huge':
									hugeMessage += '-- ' + items[indexList[i]].split(' - ')[j].split(' _ ')[0] + '\n';
									break;
								case 'Major':
									majorMessage += '-- ' + items[indexList[i]].split(' - ')[j].split(' _ ')[0] + '\n';
									break;
								case 'Minor':
									minorMessage += '-- ' + items[indexList[i]].split(' - ')[j].split(' _ ')[0] + '\n';
									break;
								case 'Offspec':
									offspecMessage += '-- ' + items[indexList[i]].split(' - ')[j].split(' _ ')[0] + '\n';
									break;
								}
							}
							if (hugeMessage.length == 10) {
								hugeMessage = '';
							}
							if (majorMessage.length == 10) {
								majorMessage = '';
							}
							if (minorMessage.length == 10) {
								minorMessage = '';
							}
							if (offspecMessage.length == 10) {
								offspecMessage = '';
							}
							preparedMessage += hugeMessage + majorMessage + minorMessage + offspecMessage;
							// eslint-disable-next-line quotes
							preparedMessage += "```";
							message.channel.send(preparedMessage);
						}
						// messagePrep for item specific
						else if (Object.keys(items)[i] == arg.join(' ')) {
							// eslint-disable-next-line quotes
							preparedMessage = "```" + Object.keys(items)[i] + '\n';
							hugeMessage = '- Prio: 1\n';
							majorMessage = '- Prio: 2\n';
							minorMessage = '- Prio: 3\n';
							offspecMessage = '- Prio: 4\n';
							for (let j = 0; j < items[indexList[i]].split(' - ').length; j++) {
								switch (items[indexList[i]].split(' - ')[j].split(' _ ')[1]) {
								case 'Huge':
									hugeMessage += '-- ' + items[indexList[i]].split(' - ')[j].split(' _ ')[0] + '\n';
									break;
								case 'Major':
									majorMessage += '-- ' + items[indexList[i]].split(' - ')[j].split(' _ ')[0] + '\n';
									break;
								case 'Minor':
									minorMessage += '-- ' + items[indexList[i]].split(' - ')[j].split(' _ ')[0] + '\n';
									break;
								case 'Offspec':
									offspecMessage += '-- ' + items[indexList[i]].split(' - ')[j].split(' _ ')[0] + '\n';
									break;
								}
							}
							if (hugeMessage.length == 10) {
								hugeMessage = '';
							}
							if (majorMessage.length == 10) {
								majorMessage = '';
							}
							if (minorMessage.length == 10) {
								minorMessage = '';
							}
							if (offspecMessage.length == 10) {
								offspecMessage = '';
							}
							preparedMessage += hugeMessage + majorMessage + minorMessage + offspecMessage;
							// eslint-disable-next-line quotes
							preparedMessage += "```";
							message.channel.send(preparedMessage);
						}
					}
				}
			}
			else {
				message.channel.send('Das gesuchte Item/der gesuchte Boss wurde nicht gefunden');
			}
		});

	},
};