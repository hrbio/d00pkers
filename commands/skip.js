module.exports = {
    name: 'skip',
    description: 'Skipuje piosenke',
    usage: '-skip',
    aliases: ['n'],
    args: false,
    execute(player, message, args) {
        const queue = player.getQueue(message.guild);
        if (!queue) return;
        const nowPlaying = queue.nowPlaying().title
        console.log(nowPlaying)
    } 
}