const Discord = require('discord.js');
const fs = require('fs');
const schedule = require('node-schedule');
const configFile = require('./config.json');
const client = new Discord.Client();
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.once('ready', () => {
	console.log('Ready!');
	// activate for maxi reminder
	if (configFile['maxi-reminded'] == false) {
		client.commands.get('remindMoxi').execute(client);
	}
});

client.login(configFile.token);

const raidSchedRule = new schedule.RecurrenceRule();
raidSchedRule.dayOfWeek = 2;
raidSchedRule.hour = 20;
raidSchedRule.minute = 0;

// eslint-disable-next-line no-unused-vars
const jobRaidRemind = schedule.scheduleJob(raidSchedRule, function() {
	client.commands.get('remind').execute(client);
});
// is der reminder fia maxi
const scheduler = new ToadScheduler();
const moxiPongTask = new Task('maxiPong', () => {
	client.commands.get('pongMoxi').execute(client);
});
const moxiPongJob = new SimpleIntervalJob({ hours: 1 }, moxiPongTask);
scheduler.addSimpleIntervalJob(moxiPongJob);

client.on('message', message => {
	if (message.channel.id !== 736983487126700065) {
		if (!message.content.startsWith(configFile.prefix) || message.author.bot) return;

		const args = message.content.slice(configFile.prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		if (!client.commands.has(commandName)) return;

		const command = client.commands.get(commandName);

		try {
			command.execute(message, client, args);
		}
		catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}
});