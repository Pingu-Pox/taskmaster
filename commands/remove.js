import { SlashCommandSubcommandBuilder, PermissionsBitField } from "discord.js";
import fs from "fs";

const NAME = "remove";
const DESCRIPTION = "Removes an element from the selected element pool.";
const filepath = "data/poolClanStaged.json";
const trashpath = "data/deletedObjects.json";

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
                    { name: "Scenario", value: "Scenario" },
                    { name: "Type", value: "Type" },
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
    const elementKey = interaction.options.getString("elementkey");
    const keyToDelete = interaction.options.getString("key");
    let poolData = {};
    let trashData = {};
    let poolObj = {};
    let trashObj = {};

    try {
        // Read the pool
        poolData = fs.readFileSync(
            `./data/pool${elementKey}Staged.json`,
            "utf8"
        );

        poolObj = JSON.parse(poolData);
        console.log("poolData output: \n" + poolData);
    } catch (err) {
        console.error(`Failed to read pool${elementKey}Staged.json\n` + err);
    }

    try {
        // Read the trash
        trashData = fs.readFileSync(
            `./data/trash${elementKey}Staged.json`,
            "utf8"
        );

        trashObj = JSON.parse(trashData);
        console.log("trashData output: \n" + trashData);
    } catch (err) {
        console.error(`Failed to read trash${elementKey}Staged.json\n` + err);
        fs.writeFileSync(`./data/trash${elementKey}Staged.json`, "");
        console.log(`Recreated trash${elementKey}Staged.json`);
    }

    if (poolObj.hasOwnProperty(keyToDelete)) {
        console.log(
            'Found key "' +
                keyToDelete +
                '" in ' +
                `./data/pool${elementKey}Staged.json`
        );
        if (!Array.isArray(trashObj)) {
            trashObj = []; // make sure trashObj is an array
        }
        trashObj.push(poolObj[keyToDelete]);
        console.log("Time to write the changes to the trash");
        fs.writeFile(
            `./data/trash${elementKey}Staged.json`,
            JSON.stringify(trashObj, null, 2),
            (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(
                    `Key ${keyToDelete} copied successfully from pool${elementKey}Staged.json to trash${elementKey}Staged.json.`
                );
            }
        );

        delete poolObj[keyToDelete];
        fs.writeFile(
            `./data/pool${elementKey}Staged.json`,
            JSON.stringify(poolObj, null, 2),
            (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(
                    `Key ${keyToDelete} deleted successfully from pool${elementKey}Staged.json`
                );
            }
        );
        interaction.reply({
            content: `Key ${keyToDelete} deleted successfully from pool${elementKey}Staged.json`,
            ephemeral: true,
        });
    } else {
        console.log(
            `Key ${keyToDelete} not found in pool${elementKey}Staged.json`
        );
        interaction.reply({
            content: `Key ${keyToDelete} not found in pool${elementKey}Staged.json`,
            ephemeral: true,
        });
    }
};

export { create, DESCRIPTION, invoke, NAME };
