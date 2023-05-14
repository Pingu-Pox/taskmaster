import { SlashCommandBuilder } from "discord.js";
import * as add from "./add.js";
import * as remove from "./remove.js";
import * as list from "./list.js";
import * as merge from "./merge.js";
import * as commission from "./commission.js";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandBuilder()
        .setName("task")
        .setDescription("Base command for the Calgrim the Taskmaster.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName(add.NAME)
                .setDescription(add.DESCRIPTION)
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
                        .setName("elementvalue")
                        .setDescription("The value of the element to add.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(remove.NAME)
                .setDescription(remove.DESCRIPTION)
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
                        .setName("key")
                        .setDescription("The uuid of the element to remove.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(list.NAME)
                .setDescription(list.DESCRIPTION)
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
                        .setDescription(
                            "Which environment to list, Staged or Live."
                        )
                        .setRequired(true)
                        .addChoices(
                            { name: "Live", value: "Live" },
                            { name: "Staged", value: "Staged" },
                            { name: "Trash", value: "Trash" }
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName(merge.NAME).setDescription(merge.DESCRIPTION)
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(commission.NAME)
                .setDescription(commission.DESCRIPTION)
        );

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = async (interaction) => {
    const subCommand = interaction.options.getSubcommand();

    if (subCommand === "add") {
        await add.invoke(interaction);
    } else if (subcommand === "remove") {
        await remove.invoke(interaction);
    } else if (subcommand === "list") {
        await list.invoke(interaction);
    } else if (subcommand === "merge") {
        await merge.invoke(interaction);
    } else if (subcommand === "commission") {
        await commission.invoke(interaction);
    } else {
        interaction.reply({
            content: "Invalid subcommand: " + subCommand,
            ephemeral: true,
        });
    }
};

export { create, invoke };
