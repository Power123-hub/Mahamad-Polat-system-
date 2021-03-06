const { MessageEmbed, MessageCollector } = require("discord.js");

module.exports = {
    async run(client, message, args, prefix) {
        if (message.author.id === client.configs.ownerID) {
            const e = new MessageEmbed()
            .setColor(client.colors.blue)
            .setTitle("Menu reload.")
            .setDescription("āļø Pour recharger une commande.\nš£ Pour recharger un event.\nā Pour annuler.");
    
            const msg = await message.channel.send(e);
    
            msg.react("āļø");
            msg.react("š£");
            msg.react("ā");
    
            const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
    
            collector.on("collect", async (reaction) => {
                if (reaction.emoji.name === "āļø") {
                    const filter = (m) => m.author.id === message.author.id;
    
                    const cmdReload = new MessageCollector(message.channel, filter, {
                        max: 1,
                        time: 1000 * 10
                    });
    
                    const e = new MessageEmbed()
                    .setColor(client.colors.blue)
                    .setTitle("Menu reload.")
                    .setDescription("Merci de me donner la commande Ć  reload ci dessous.");
    
                    msg.edit(e);
                    msg.reactions.removeAll();   
                    msg.react("ā");
    
                    cmdReload.on('collect', (m) => {});
    
                    cmdReload.on("end", (collected) => {
                        collected.forEach((value) => {
                            if (!value.content) {
                                return message.reply("Merci de me donner une commande Ć  recharger.")
                            }
                            else if (value.content) {
                                const commandName = value.content.toLowerCase(), command = client.commands.get(commandName) || client.commands.find(x => x.help.aliases && x.help.aliases.includes(commandName));
                                
				if (!command) return message.reply(`Je ne possĆØde pas de commande nommĆ©e \`${commandName}\``);

                                delete require.cache[require.resolve(`./${command.help.name}.js`)];
                                
                                try {
                                    let props = require(`./${command.help.name}`);
                                    client.commands.set(props.help.name, props);
                                    if (props.help.aliases) {
                                        props.help.aliases.forEach(alias => {
                                            client.aliases.set(alias, props)
                                        })
                                    }
                                    if (props.help.category) {
                                        client.categories.set(props.help.category, props)
                                    }
                                    message.channel.send(`Commande ${command.help.name} rechargĆ©e.`)
                                }
                                catch (error) {
                                    console.error(error);
                                    message.channel.send("Une erreur est survenu lors du rechargement.")
                                }
                            }
    
                            msg.delete({timeout: 3000});
                        })
                    })
                }
                else if (reaction.emoji.name === "š£") {
                    const filter = (m) => m.author.id === message.author.id;
    
                    const evtReload = new MessageCollector(message.channel, filter, {
                        max: 1,
                        time: 1000 * 10
                    });
    
                    const e = new MessageEmbed()
                    .setColor(client.colors.blue)
                    .setTitle("Menu reload.")
                    .setDescription("Merci de me donner la event Ć  reload ci dessous.");
    
                    msg.edit(e);
                    msg.reactions.removeAll();   
                    msg.react("ā");
    
                    evtReload.on('collect', (m) => {});
    
                    evtReload.on("end", (collected) => {
                        collected.forEach((value) => {
                            if (!value) {
                                message.reply("Merci de me donner une event Ć  recharger.")
                            }
                            else if (value) {
                                const eventName = value.content;
    
                                const event = require(`../events/${eventName}`);
                    
                                const res = client.listeners(eventName)
                                
                                try {
                                    client.off(eventName, res[0]);
                                    client.on(eventName, event.bind(null, client));
                                    message.channel.send(`Event ${eventName} rechargĆ©.`)
                                    delete require.cache[require.resolve(`../events/${eventName}`)];
                                }
                                catch (error) {
                                    console.error(error);
                                    message.channel.send("Une erreur est survenu lors du rechargement de l'event.")
                                }
                            }
    
                            msg.delete({timeout: 3000});
                        })
                    })
                }
                else if (reaction.emoji.name === "ā") {
                    const e = new MessageEmbed()
                    .setColor(client.colors.blue)
                    .setTitle("Menu reload.")
                    .setDescription("Commande annulĆ©e.");
    
                    msg.edit(e);
                    msg.reactions.removeAll();
                    msg.delete({timeout: 3000});
                }
            })
        }
        else {
            message.reply("Seul le propriĆ©taire du bot peut exĆ©cuter cette commande.")
        } 
    }
}

module.exports.help = {
    name: "reload",
    aliases: ["cmdreload", "eventreload", "reloads"],
    category: "owner",
    description: "Permet de recharger un event ou une commande du bot.",
}