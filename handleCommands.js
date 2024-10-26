const fs = require('fs');

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandsFolders = fs.readdirSync('./src/commands');
        for (const folder of commandsFolders) {
            const commandsFiles = fs
            .readdirSync(`./src/commands/${folder}`)
            .filter(file => file.endsWith('.js'));
        
           const{ commands, commandArray} = client
            for (const file of commandsFiles){
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);               
                commandArray.push(command, command.data.toJSON());
            }

        }
    };
};