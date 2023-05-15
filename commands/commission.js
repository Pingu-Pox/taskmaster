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
    // Note: Elected to use role IDs instead of names, just in case someone renames a role. This does not protect against roles being deleted and recreated.

    // All commercial roles - these users will get a scenario based on the creation of said item, as well as delivery
    const commercialRoles = [
        "1107428487117160559", // ironguardCommercial1
        "0", // ironguardCommercial2
        "0", // ironguardCommercial3
        "0", // ironguardCommercial4
        "0", // ironguardCommercial5
        "0", // ironguardCommercialNCO
        "1107436886210924676", // ironHawk
        "1107428105074778153", // toiler
        "0", // farmhand
        "0", // herdsman
        "0", // rancher
        "0", // keeper
        "0", // shepherd
        "1107437108932640839", // ramkeeper
        "1107428358276517888", // initiate
        "0", // apprentice
        "0", // journeydwarf
        "0", // glyphscribe
        "0", // runespeaker
        "0", // masterCrafter
        "1107437593806786642", //ascendantCraftsdwarf
    ];

    // All logistical roles - these users will get a scenario based on the overseeing of others
    const logisticalRoles = [
        "1107428535683006594", // ironguardLogistical1
        "0", // ironguardLogistical2
        "0", // ironguardLogistical3
        "0", // ironguardLogistical4
        "0", // ironguardLogistical5
        "0", // ironguardLogisticalNCO
        "1107436948869615746", // ministerOfCoin
        "1107428271253110886", // promoter
        "0", // talespinner
        "0", // storyteller
        "0", // fabler
        "0", // chronicler
        "0", // brewmaster
        "1107437034701848628", // hearthmaven
        "1107428404384501821", // student
        "0", // librarian
        "0", // scholar
        "0", // historian
        "0", // archaeologist
        "0", // lorekeeper
        "1107437674597449768", // loremaster
    ];

    // All martial roles - these users will get a scenario based on the aquisition of materials
    const martialRoles = [
        "1107428436911337533", // ironguardMartial1
        "0", // ironguardMartial2
        "0", // ironguardMartial3
        "0", // ironguardMartial4
        "0", // ironguardMartial5
        "0", // ironguardMartialNCO
        "1107436994340081734", // generalOfIron
        "1107428232174780456", // adventurer
        "0", // scout
        "0", // seeker
        "0", // outrider
        "0", // ranger
        "0", // slayer
        "1107437135096729691", // pathfinder
        "1107428316580954214", // acolyte
        "0", // missionary
        "0", // inquisitor
        "0", // exorcist
        "0", // crusader
        "0", // arbiter
        "1107437707896041595", // grandArbiter
    ];

    // All special roles
    const specialRoles = [
        "1107454215179206697", // kin
        "1107454006680363129", // thaneIronguard
        "1107454134346588230", // thaneRamheart
        "1107454168299479050", // thaneRuneforge
        "1107454274012717216", // matriarch
    ];

    // Inside your command handler or interaction event
    const userRoles = interaction.member.roles.cache; // Get the roles of the interaction member

    // Check if the user has any of the specified roles
    if (specialRoles.some((roleId) => userRoles.has(roleId))) {
        // If user has a special role, grab a scenario from any of the three pools
        interaction.reply({
            content: "You have a special role!",
            ephemeral: true,
        });
    } else if (commercialRoles.some((roleId) => userRoles.has(roleId))) {
        // Grab a scenario from the commercial pool
        interaction.reply({
            content: "You have a commercial role!",
            ephemeral: true,
        });
    } else if (logisticalRoles.some((roleId) => userRoles.has(roleId))) {
        // Grab a scenario from the logistical pool
        interaction.reply({
            content: "You have a logistical role!",
            ephemeral: true,
        });
    } else if (martialRoles.some((roleId) => userRoles.has(roleId))) {
        // Grab a scenario from the martial pool
        interaction.reply({
            content: "You have a martial role!",
            ephemeral: true,
        });
    } else {
        // User wasn't in any approved roles, send them a reply telling them to reach out to leadership to get permission to participate.
        interaction.reply({
            content: `Hail ${interaction.member.displayName}, I only assign commissions to members of Dünhold.`,
            ephemeral: true,
        });
        return;
    }

    // Reply an ephemeral embed with a randomized object.

    // Roll scenario (e.g. Your first craft)
    // if ironguard martial, adventurer, or acolyte role detected
    // else if ironguard commercial, toiler, or initiate role detected
    // else if ironguard logistical, promoter, or student role detected
    // else no matching roles detected
    // have scenario stored as string

    // Roll type (e.g. armor)
    // Roll sub-type (e.g. helmet)

    // Roll metal (e.g. bronze)
    // Roll wood (e.g. birch)
    // Roll stone (e.g. basalt)
    // Roll misc (e.g. linen)
    // Roll gem (e.g. diamond)
    // Roll enchant (e.g. bane)

    // 5% chance to blank a material type

    // Send embed, with a button to set an element as "user-defined"
};

export { create, DESCRIPTION, invoke, NAME };
