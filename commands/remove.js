import { SlashCommandSubcommandBuilder, PermissionsBitField } from "discord.js";
import {} from "dotenv/config";
import fs from "fs";

const NAME = "remove";
const DESCRIPTION = "Removes an element from the selected element pool.";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION)
        .addStringOption((option) =>
            option
                .setName("elementkey")
                .setDescription("The type of element to add.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "Scenario-Commercial",
                        value: "Scenario-Commercial",
                    },
                    {
                        name: "Scenario-Logistical",
                        value: "Scenario-Logistical",
                    },
                    { name: "Scenario-Martial", value: "Scenario-Martial" },
                    { name: "Armor", value: "Armor" },
                    { name: "Jewelry", value: "Jewelry" },
                    { name: "Artifact", value: "Artifact" },
                    { name: "Weapon", value: "Weapon" },
                    { name: "Tool", value: "Tool" },
                    { name: "Instrument", value: "Instrument" },
                    { name: "Metal", value: "Metal" },
                    { name: "Wood", value: "Wood" },
                    { name: "Stone", value: "Stone" },
                    { name: "Misc", value: "Misc" },
                    { name: "Gem", value: "Gem" },
                    { name: "Enchant", value: "Enchant" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("key")
                .setDescription("The uuid of the element to remove.")
                .setRequired(true)
        );

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    const elementKey = interaction.options
        .getString("elementkey")
        .toLowerCase();
    const keyToDelete = interaction.options.getString("key");
    let poolData = {};
    let trashData = {};
    let poolObj = {};
    let trashObj = {};

    const canRunCommand = [
        `${process.env.AUTHORIZED_ADMINS}`,
    ];

    const userRoles = interaction.member.roles.cache; // Get the roles of the interaction member

    if (!canRunCommand.includes(interaction.member.id)) {
        interaction.reply({
            content: "You are not permitted to use this command.",
            ephemeral: true,
        });
        console.log(
            `${interaction.member.displayName} tried running /task remove ${elementKey} ${keyToDelete}, but lacked permissions.`
        );
        return;
    } else {
        console.log(
            `${interaction.member.displayName} tried running /task remove ${elementKey} ${keyToDelete}, and has permissions to do so.`
        );
    }

    try {
        // Read the pool
        poolData = fs.readFileSync(`./data/staged/${elementKey}.json`, "utf8");

        poolObj = JSON.parse(poolData);
        console.log("poolData output: \n" + poolData);
    } catch (err) {
        console.error(`Failed to read ${elementKey}.json\n` + err);
    }

    try {
        // Read the trash
        trashData = fs.readFileSync(`./data/trash/${elementKey}.json`, "utf8");

        trashObj = JSON.parse(trashData);
        console.log("trashData output: \n" + trashData);
    } catch (err) {
        console.error(`Failed to read ${elementKey}.json\n` + err);
        fs.writeFileSync(`./data/trash/${elementKey}.json`, "");
        console.log(`Recreated ${elementKey}.json`);
    }

    if (poolObj.hasOwnProperty(keyToDelete)) {
        console.log(
            'Found key "' +
                keyToDelete +
                '" in ' +
                `./data/staged/${elementKey}.json`
        );
        if (!Array.isArray(trashObj)) {
            trashObj = []; // make sure trashObj is an array
        }
        trashObj.push(poolObj[keyToDelete]);
        console.log("Time to write the changes to the trash");
        fs.writeFile(
            `./data/trash/${elementKey}.json`,
            JSON.stringify(trashObj, null, 2),
            (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(
                    `Key ${keyToDelete} copied successfully from ${elementKey}.json to ${elementKey}.json.`
                );
            }
        );

        delete poolObj[keyToDelete];
        fs.writeFile(
            `./data/staged/${elementKey}.json`,
            JSON.stringify(poolObj, null, 2),
            (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(
                    `Key ${keyToDelete} deleted successfully from ${elementKey}.json`
                );
            }
        );
        interaction.reply({
            content: `Key ${keyToDelete} deleted successfully from ${elementKey}.json`,
            ephemeral: true,
        });
    } else {
        console.log(`Key ${keyToDelete} not found in ${elementKey}.json`);
        interaction.reply({
            content: `Key ${keyToDelete} not found in ${elementKey}.json`,
            ephemeral: true,
        });
    }
};

export { create, DESCRIPTION, invoke, NAME };
