const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');

const fs = require('fs');

const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ]
});

const { token, prefix } = require("./config.js");


client.messageCommand = new Collection();

const messageFiles = fs.readdirSync(path.join(__dirname, 'messageCommand')).filter(file => file.endsWith('.js'));

for (const file of messageFiles) {
    const message = require(`./messageCommand/${file}`);
    client.messageCommand.set(message.name, message);
}


client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const messageName = args.shift().toLowerCase();  

    const messagess = client.messageCommand.get(messageName) || client.messageCommand.find(cmd => cmd.alliases && cmd.alliases.includes(messageName));

    if (!messagess) return;

    try {
        messagess.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('حصل خطا في البوت');
    }
});


client.once("ready", async () => {
console.log("ready " + client.user.username);
    client.user.setActivity("MAYOR Studio", {
type: ActivityType.Playing
});
});


client.login(token)
