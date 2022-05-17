// IMPORTS
const fs = require('fs');
require('dotenv').config();

const figlet = require('figlet');
const gradient = require('gradient-string');
const chalk = require('chalk');

const { prefix } = require('./config.json');

const { Player } = require("discord-player");
const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
// END IMPORTS


// VARIABLES
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES] });
const player = new Player(client);


// COMMANDS IMPORT INIT
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


// WELCOME SCREEN
console.clear();
figlet('d00pkers', (err, data) => {
    if (err) return;
    console.log(gradient.pastel.multiline(data));
});

// ON READY
client.once('ready', async () => {
    console.log(`${chalk.bgGreen('ONLINE')} jako ${chalk.green(client.user.tag)}`);
});

// ON MESSAGE
client.on('messageCreate', message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    console.log(`${message.author.tag} wysłał(a): ${message.content}`)
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // CHECK IF COMMAND EXISTS
    if (!command) return message.reply({ embeds: [new MessageEmbed()
        .setTitle('Błąd').setColor('#ff0000').
        setDescription('Nie ma takiej komendy')
        .setTimestamp()]})

    // CHECK IF THERE ARE ARGUMENTS NEEDED AND IF SO CHECK IF THERE ARE ARGUMENTS
    if(command.args && !args.length){
        return message.reply({ embeds: [new MessageEmbed()
            .setTitle('Błąd')
            .setColor('#ff0000')
            .setDescription('Brakuje mi argumentów... 😢')
            .setTimestamp()]});
    };
    // TRY TO EXECUTE THE COMMAND
    try{
        // IF COMMAND IS DISABLED RETURN ERROR
        if (command.disabled) return message.channel.send({ embeds: [new MessageEmbed()
            .setTitle('Błąd')
            .setColor('#ff0000')
            .setDescription('Nie ma takiej komendy')
            .setTimestamp()]});
        // EXECUTE IT
        command.execute(player, message, args);
    }
    // CATCH ANY ERRORS 
    catch(e){
        console.error(chalk.red(e))
        message.reply({ embeds: [new MessageEmbed()
            .setTitle('Błąd')
            .setColor('#ff0000')
            .setDescription('Napotkałem problem... 💀')
            .setTimestamp()]})
    }
});

player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`));
player.on("trackEnd", (queue, track) => queue.metadata.channel.send(`chuj`));

// IMPORT COMMANDS
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

client.login(process.env.DISCORD_TOKEN);