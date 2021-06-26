module.exports = {
	name: 'pongMoxi',
	description: 'Reminds Maxi not to be a fucking moron',
	execute(client) {
		const config = require('../../config.json');
		if (!config['maxi-reminded']) {
			client.channels.cache.get('856576341314371604').send('<@292080228971577345> crafte deinen shit');
		}
	},
};