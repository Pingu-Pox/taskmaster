import { SlashCommandSubcommandBuilder, EmbedBuilder } from "discord.js";

const NAME = "help";
const DESCRIPTION = "Checks bot's online status, and display help page";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION);

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    const currentDate = new Date();
    // Get the current date in a human-readable format
    const date = currentDate.toLocaleDateString();

    // Get the current time in a human-readable format
    const time = currentDate.toLocaleTimeString();

    // Combine the date and time
    const onlineMessage = `Calgrim is online as of ${date} ${time}`;

    const helpPage =
        "**Verbage:**\n" +
        "Staged = Un-finalized additions (will NOT show up in commissions yet)\n" +
        "Live = Finalized additions (will show up in commissions)\n" +
        "Trash = Deleted by admins (will NOT show up in commissions ever)";
    const embed = new EmbedBuilder()
        .setColor("DarkPurple")
        .setTitle(onlineMessage)
        .setURL("https://dünhold.com")
        //.setDescription(helpPage)
        .setThumbnail(
            "https://xn--dnhold-3ya.com/wp-content/uploads/2023/05/Calgrim-the-Taskmaster.png"
        )
        .addFields({
            name: "Add",
            value: "Adds an element to a pool",
            inline: false,
        })
        .addFields({
            name: "Commission",
            value: "Reads all live pools, and generates a commission",
            inline: false,
        })
        .addFields({
            name: "Help",
            value: "Shows this message",
            inline: false,
        })
        .addFields({
            name: "List",
            value: "Lists the contents of a pool",
            inline: false,
        })
        .addFields({
            name: "Merge",
            value: "Finalizes changes and moves them to the live pools (Requires permission)",
            inline: false,
        })
        .addFields({
            name: "Remove",
            value: "Removes an element from a pool (Requires permission)",
            inline: false,
        })
        .setTimestamp()
        .setFooter({
            text: "Dünhold LLC.",
            iconURL:
                "https://xn--dnhold-3ya.com/wp-content/uploads/2023/08/Dunhold-Logo-copywrite.png",
        });

    interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
};

export { create, DESCRIPTION, invoke, NAME };
