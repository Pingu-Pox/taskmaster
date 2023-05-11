import { SlashCommandSubcommandBuilder } from "discord.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const NAME = "add";
const DESCRIPTION = "Add an element to the commission list";

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
    const dataObj = {};

    try {
        // Try to read the file in question, if read, set dataObj to a parsed version of the read buffer.
        console.log(`Attempting to read ${elementKey}.json...`);
        fs.readFile(
            `./data/pool${elementKey}Staged.json`,
            "utf8",
            (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }

                dataObj = JSON.parse(data);
                console.log("Outputing dataObj after parsing");
                console.log(dataObj);
            }
        );
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
            `Attempting to write ${elementKey} "${elementValue}" added to ${elementKey}.json.`
        );
        fs.writeFile(
            `./data/pool${elementKey}Staged.json`,
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
