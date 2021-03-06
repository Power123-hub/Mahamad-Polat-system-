module.exports.run = async (client, message) => {
if (!message.member.voice.channel) return message.channel.send(`Vous n'êtes pas dans un salon vocal.`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`Vous n'êtes pas dans le même canal vocal que moi.`);

        if (!client.player.getQueue(message)) return message.channel.send(`Aucune musique en cours.`);

        if (client.player.getQueue(message).paused) return message.channel.send(`La musique est déjà en pause.`);

        const success = client.player.pause(message);

        if (success) message.channel.send(`La musique ${client.player.getQueue(message).playing.title} a été mis en pause.`);
}

module.exports.help = {
    description: "Permet de mettre en pause la musique.",
    name: "pause",
    aliases: ["pau", "musicpause", "musicpau"],
    category: "music"
}