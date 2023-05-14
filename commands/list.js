import {
    SlashCommandSubcommandBuilder,
    Attachment,
    AttachmentBuilder,
    MessagePayload,
} from "discord.js";
import fs from "fs";

const NAME = "list";
const DESCRIPTION = "Lists all elements for a given element pool.";
const MAX_MESSAGE_SIZE = 2000;

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
                .setName("envtype")
                .setDescription("Which environment to list, Staged or Live.")
                .setRequired(true)
                .addChoices(
                    { name: "Live", value: "Live" },
                    { name: "Staged", value: "Staged" },
                    { name: "Trash", value: "Trash" }
                )
        );

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    const elementKey = interaction.options.getString("elementkey");
    const envType = interaction.options.getString("envtype").toLowerCase();
    const authorName = interaction.member.displayName;

    try {
        fs.readFile(
            `data/${envType}/${elementKey}.json`,
            "utf8",
            (err, pool) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // Check if the file is too large for a single message
                console.log("Message length is: " + pool.length);
                if (pool.length <= MAX_MESSAGE_SIZE) {
                    // Output the JSON data directly as a Discord message
                    interaction.reply({
                        content: "```" + pool + "```",
                        ephemeral: true,
                    });
                } else {
                    const buffer = Buffer.from(pool, "utf-8");
                    const attachment = new AttachmentBuilder(buffer, {
                        name: `pool${elementKey}${envType}.json`,
                    });
                    interaction.reply({
                        content: `Here's the ${envType} list of the ${elementKey} types`,
                        files: [attachment],
                        ephemeral: true,
                    });
                }
            }
        );
    } catch (err) {
        console.error(err);
        return;
    }
};

export { create, DESCRIPTION, invoke, NAME };
