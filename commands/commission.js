import { SlashCommandSubcommandBuilder } from "discord.js";
import fs from "fs";

const NAME = "commission";
const DESCRIPTION = "Get an assignment from Calgrim the Taskmaster";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION);

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    interaction.reply({
        // Reply an ephemeral embed with a randomized object.
    });
};

export { create, DESCRIPTION, invoke, NAME };
