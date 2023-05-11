import { SlashCommandBuilder } from "discord.js";
import * as add from "./add.js";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandBuilder()
        .setName("task")
        .setDescription("Base command for the Calgrim the Taskmaster.")
        .addSubcommand((subcommand) =>
            subcommand.setName(add.NAME).setDescription(add.DESCRIPTION)
        );

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = async (interaction) => {
    const subCommand = interaction.options.getSubcommand();

    if (subCommand === "add") {
        await add.invoke(interaction);
    } else {
        interaction.reply({
            content: "Invalid subcommand: " + subCommand,
            ephemeral: true,
        });
    }
};

export { create, invoke };
