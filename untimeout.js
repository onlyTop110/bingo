const { SlashCommandBuilder, EmbedBuilder, PerrmisionsBitField, time } = require('discord.js');
const { execute } = require('../commands/echo');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('unTimes out a server member')
    .addUserOption(option => option.setName('user').setDescription('the user you want to untimeout').setRequired(true))
   
    .addStringOption(option => option.setName('reason').setDescription('The Reasion for untiming out the user')),
    async execute(interaction) {

        const timeUser = interaction.option.getUser('user');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        

        if (!interaction.member.permissions.has(PerrmisionsBitField.Flags.ModerateMembers)) return await interaction.reply({content: `You Must have the moderate members perm to use this commands`})   
        if (!timeMember) return await interaction.reply({content: 'The user mentioned is no longer within the server', ephemeral: true});
        if (!timeMember.kickable) return await interaction.reply({content: 'I connot untimeout this user! That is because either their role or rhemselves are above me!',ephemeral: true});
        if(interaction.member.id === timeMember.id)return await interaction.reply({content: 'you cannot timeout yourself!', ephemeral: true});    
        if (timeMember.permissions.has(PerrmisionsBitField.Flags.Administrator))return await interaction.reply({content: 'you connot timeout a person with the admin permisson',ephemeral: true});        
    
        let reason = interaction.options.getString('reason') || 'no reason given';

        await timeMember.timeout(null,reason);

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  ${timeUser.tag}'s timeout has been **removed** | ${reason} `)

        const dmEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  You have been **untime out**  in ${interaction.guild.name} | ${reason}  `)
    
        await timeMember.send({embed: [dmEmbed]}).catch(err => {
            return;
        })
        await interaction.reply({embeds: [embed] });
    }
}