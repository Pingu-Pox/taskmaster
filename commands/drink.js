import { SlashCommandSubcommandBuilder } from "discord.js";
import fs from "fs";

const NAME = "drink";
const DESCRIPTION = "Take a swig from the Brew of Beginnings.";
const poolClanPath = "data/poolClan.json";
const poolPillarPath = "data/poolPillar.json";
const numScenarios = 10; // must be an even number

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION);

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    // Message in the channel /drink was sent in, letting the user know they're about to ponder
    interaction.reply({
        content:
            "\"This'll sort ye' out!\" You take a swig of the `Brew of Beginnings`, your head drops to the bar as you begin to ponder...",
        ephemeral: true,
    });

    // Get the actual amount of scenarios to grab, this factors in the total of scenarios and the extra scenarios for tie-breakers
    var numEachScenario = Math.floor((numScenarios + 2) / 2);

    // Grab 5 objects from the clan pool
    fs.readFile(poolClanPath, "utf8", (err, clan) => {
        if (err) {
            console.error(err);
            return;
        }
        const clanObj = JSON.parse(clan);
        const clanKeys = Object.keys(clanObj);
        const randomIndices = [];
        const randomClans = [];

        // Generate an array of 5 unique random indices without duplicates
        while (randomIndices.length < numEachScenario) {
            const randomIndex = Math.floor(Math.random() * clanKeys.length);
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
            }
        }

        // Select the 5 random clans
        randomIndices.forEach((index) => {
            const clanName = clanKeys[index];
            const clanData = clanObj[clanName];
            randomClans.push({
                name: clanName,
                data: clanData,
            });
        });

        // randomClans is an object with indices pointing to 5 random pillar keys
        //console.log(randomClans);

        fs.readFile(poolPillarPath, "utf8", (err, pillar) => {
            if (err) {
                console.error(err);
                return;
            }
            const pillarObj = JSON.parse(pillar);
            const pillarKeys = Object.keys(pillarObj);
            const randomIndices2 = [];
            const randomPillars = [];

            // Generate an array of 5 unique random indices without duplicates
            while (randomIndices2.length < numEachScenario) {
                const randomIndex = Math.floor(
                    Math.random() * pillarKeys.length
                );
                if (!randomIndices2.includes(randomIndex)) {
                    randomIndices2.push(randomIndex);
                }
            }

            // Select the 5 random pillar scenarios
            randomIndices2.forEach((index) => {
                const pillarName = pillarKeys[index];
                const pillarData = pillarObj[pillarName];
                randomPillars.push({
                    name: pillarName,
                    data: pillarData,
                });
            });

            // randomPillars is an object with indices pointing to 5 random clan keys
            //console.log(randomPillars.answers);

            // Combine the two arrays and shuffle the elements randomly
            const specialBrew = [...randomClans, ...randomPillars];
            for (let i = specialBrew.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [specialBrew[i], specialBrew[j]] = [
                    specialBrew[j],
                    specialBrew[i],
                ];
            }

            // A brew, hopefully!
            console.log(specialBrew);
        });
    });

    // Order them, then display them one by one
    // Make sure to accumulate points based on buttons pressed.

    // const largeImage = new AttachmentBuilder("./img/dwarvenTraveler.png", {
    //     name: "largeImage.png",
    // });

    // const embedStandard = new EmbedBuilder()
    //     .setTitle("You set out on a quest. Which do you bring?")
    //     .setImage(`attachment://${largeImage.name}`)
    //     .setColor(0xffa72c)
    //     .setFooter({
    //         text: "2/10",
    //     });

    // const button1 = new ButtonBuilder()
    //     .setCustomId("button1")
    //     .setLabel("A book")
    //     .setStyle("Secondary");

    // const button2 = new ButtonBuilder()
    //     .setCustomId("button2")
    //     .setLabel("A weapon")
    //     .setStyle("Secondary");

    // const button3 = new ButtonBuilder()
    //     .setCustomId("button3")
    //     .setLabel("A coin purse")
    //     .setStyle("Secondary");

    // const row = new ActionRowBuilder().addComponents(button1, button2, button3);

    // interaction.member.send({
    //     embeds: [embedStandard],
    //     components: [row],
    //     files: [largeImage],
    // });
};

export { create, DESCRIPTION, invoke, NAME };
