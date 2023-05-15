import { SlashCommandSubcommandBuilder } from "discord.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const NAME = "add";
const DESCRIPTION = "Add an element an element pool.";

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
                .setName("elementvalue")
                .setDescription("The value of the element to add.")
                .setRequired(true)
        );
    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    const elementKey = interaction.options.getString("elementkey");
    const elementValue = interaction.options.getString("elementvalue");
    const authorName = interaction.member.displayName;
    let dataObj = {};

    const canRunCommand = [
        "1107509988798234775", // Ironguard
        "1107510015423680562", // Ramheart
        "1107509952936939641", // Runeforge
    ];

    const userRoles = interaction.member.roles.cache; // Get the roles of the interaction member

    if (!canRunCommand.some((roleId) => userRoles.has(roleId))) {
        interaction.reply("You are not permitted to use this command.");
        console.log(
            `${interaction.member.displayName} tried running /task add ${elementKey} ${elementValue}, but lacked permissions.`
        );
        return;
    } else {
        console.log(
            `${interaction.member.displayName} tried running /task add ${elementKey} ${elementValue}, and has permissions to do so.`
        );
    }

    try {
        // Try to read the file in question, if read, set dataObj to a parsed version of the read buffer.
        console.log(`Attempting to read ${elementKey}.json...`);
        const data = fs.readFileSync(
            `./data/staged/${elementKey}.json`,
            "utf8"
        );

        console.log("Outputting contents of data \n" + data);
        dataObj = JSON.parse(data);
        console.log("Outputting dataObj after parsing");
        console.log(dataObj);
    } catch (err) {
        // Failed to read the file in question, create it, the proceed.
        console.error(err);
        console.log(`Failed to read ${elementKey}.json! Recreating...`);
    } finally {
        // Prepare new JSON object
        dataObj[uuidv4()] = {
            value: elementValue,
            author: authorName,
        };
        console.log(
            `Attempting to write ${elementKey} "${elementValue}" to ${elementKey}.json.`
        );
        fs.writeFile(
            `./data/staged/${elementKey}.json`,
            JSON.stringify(dataObj, null, 2),
            (err) => {
                if (err) {
                    console.error(err);
                    interaction.reply({
                        content: `Unable to add new ${elementKey} \"${elementValue}\" to ${elementKey}.json.`,
                        ephemeral: true,
                    });
                    return;
                }
                interaction.reply({
                    content: `New ${elementKey} \"${elementValue}\" added to ${elementKey}.json.`,
                    ephemeral: true,
                });
                console.log(
                    `New ${elementKey} \"${elementValue}\" added to ${elementKey}.json.`
                );
            }
        );
    }
};

export { create, DESCRIPTION, invoke, NAME };
