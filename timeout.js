const { SlashCommandBuilder, EmbedBuilder, PerrmisionsBitField, time } = require('discord.js');
const { execute } = require('../commands/echo');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Times out a server member')
    .addUserOption(option => option.setName('user').setDescription('the user you want to timeout').setRequired(true))
    .addStringOption(option => option.setName('duraction').setRequired(true).setDescription('The duraction of the timeout').addChoices(
        
        {name: '60 seconds',value: '60'},
        {name: '2 Minutes',value: '120'},
        {name: '5 Minutes',value: '300'},
        {name: '10 Minutes',value: '600'},
        {name: '60 seconds',value: '60'},
        {name: '15 Minutes',value: '900'},
        {name: '20 Minutes',value: '1200'},
        {name: '30 Minutes',value: '1800'},
        {name: '45 Minutes',value: '2700'},
        {name: '1 Hour',value: '3600'},
        {name: '2 Hour',value: '7200'},
        {name: '3 Hour',value: '10000'},
        {name: '5 Hour',value: '36000'},
        {name: '1 Day',value: '86400'},
        {name: '2 Day',value: '172800'},
        {name: '3 Day',value: '259200'},
        {name: '5 Day',value: '432000'},
        {name: '1 Week',value:'604800'},

    ))
    .addStringOption(option => option.setName('reason').setDescription('The Reasion for timing out the user')),
    async execute(interaction) {

        const timeUser = interaction.option.getUser('user');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        const duration = interaction.options.getString('duraction');

        if (!interaction.member.permissions.has(PerrmisionsBitField.Flags.ModerateMembers)) return await interaction.reply({content: `You Must have the moderate members perm to use this commands`})   
        if (!timeMember) return await interaction.reply({content: 'The user mentioned is no longer within the server', ephemeral: true});
        if (!timeMember.kickable) return await interaction.reply({content: 'I connot timeout this user! That is because either their role or rhemselves are above me!',ephemeral: true});
        if(interaction.member.id === timeMember.id)return await interaction.reply({content: 'you cannot timeout yourself!', ephemeral: true});    
        if (timeMember.permissions.has(PerrmisionsBitField.Flags.Administrator))return await interaction.reply({content: 'you connot timeout a person with the admin permisson',ephemeral: true});        
    
        let reason = interaction.options.getString('reason') || 'no reason given';

        await timeMember.timeout(duration * 1000, reason);

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  ${timeUser.tag} has been **time out** for ${duration / 60} minute(s) | ${reason}`)
    

        const dmEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  You have been timed out in ${interaction.guild.name}. You can check status of your timeout withn the server | ${reason}  `)

        await timeMember.send({embed: [dmEmbed]}).catch(err => {
            return;
        })
        await interaction.reply({embeds: [embed] });
    }
}