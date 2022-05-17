const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'help',
    description: 'opis',
    usage: 'uzycie',
    aliases: [],
    args: false,
    execute(player, message, args) {
        const embed = new MessageEmbed()
        .setColor('#00FF00')
        .setTitle('POMOC')
        .setDescription(`[Obczaj sobie komendy 😅](https://google.com/)`);

        return message.channel.send({ embeds: [embed]});

    } 
}
