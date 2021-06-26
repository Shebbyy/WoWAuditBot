module.exports = {
	name: 'remindMoxi',
	description: 'Reminds Maxi not to be a fucking moron',
	execute(client) {
		const config = require('../../config.json');
		client.channels.cache.get('856576341314371604').send('Crafte deine scheiß Schattensteine <@292080228971577345>').then(sentmsg => {
			sentmsg.react('812305059698049035');

			const filter = (r, u) => r.emoji.id == '812305059698049035' && u.id == '292080228971577345';
			const collector = sentmsg.createReactionCollector(filter, { time: 86400000 });
			collector.on('collect', () => {
				config['maxi-reminded'] = true;
				client.channels.cache.get('856576341314371604').send('Danke jetzt gusch');
			});
		});
	},
};