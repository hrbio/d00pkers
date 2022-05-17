const { MessageEmbed, Interaction } = require("discord.js")

module.exports = {
    name: 'play',
    description: 'Puszcza piosenke se tak o normalnie',
    usage: '-play <nazwa bądź link>',
    aliases: ['p'],
    args: true,
    async execute(player, message, args) {
        if (!message.member.voice.channelId) return message.reply({embeds: [new MessageEmbed().setColor('#FF0000').setDescription('dolacz do kanalu')]});
        if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId) return message.reply({embeds: [new MessageEmbed().setColor('#FF0000').setDescription('jestes w zlym kanale')]});

        const query = args.join(' ');
        const queue = player.createQueue(message.guild, {
            leaveOnEnd: false,
            ytdlOptions: {
                filter: 'audioonly',
                highWaterMark: 1 << 30,
                dlChunkSize: 0,
            },
            metadata: {
                channel: message.channel
            }
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channelId) ;
        }
        catch {
            queue.destroy();
            return message.reply({embeds: [new MessageEmbed().setColor('#FF0000').setDescription('nie moge dolaczyc')]});
        }

        const track = await player.search(query, {
            requestedBy: message.user
        }).then(x => x.tracks[0]);
        
        if (!track) return await message.reply({embeds: [new MessageEmbed().setColor('#FF0000').setDescription(`nie znaleziono piosenki ${query}`)]});

        queue.play(track);

        return await message.reply({embeds: [new MessageEmbed().setColor('#FF0000').setDescription('dodano do kolejki')]});


    } 
}