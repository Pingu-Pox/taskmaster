import { SlashCommandSubcommandBuilder, EmbedBuilder } from "discord.js";
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
        "1102057432634630265", // ramkeeper
        "1107428358276517888", // initiate
        "0", // apprentice
        "0", // journeydwarf
        "0", // glyphscribe
        "0", // runespeaker
        "0", // masterCrafter
        "1061118295442464778", //ascendantCraftsdwarf
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
        "1107428271253110886", // merryMaker
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
        "1061118286756053052", // loremaster
    ];

    // All martial roles - these users will get a scenario based on the aquisition of materials
    const martialRoles = [
        "1107428436911337533", // ironguardMartial1
        "0", // ironguardMartial2
        "0", // ironguardMartial3
        "0", // ironguardMartial4
        "0", // ironguardMartial5
        "0", // ironguardMartialNCO
        "867287109940543518", // generalOfIron
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
        "1061118908918140958", // grandArbiter
    ];

    // All special roles
    const specialRoles = [
        "1107454215179206697", // kin
        "673298192640770060", // thane
        "661019764583432222", // matriarch
    ];

    // Inside your command handler or interaction event
    const userRoles = interaction.member.roles.cache; // Get the roles of the interaction member

    let scenarioString = "";
    let embedImage = "";
    let pillarVerb = "";
    let pillarAdj = "";
    // Check if the user has any of the specified roles
    if (specialRoles.some((roleId) => userRoles.has(roleId))) {
        // If user has a special role, grab a scenario from any of the three pools
        const assignPillar = Math.floor(Math.random() * 3);
        switch (assignPillar) {
            case 0:
                scenarioString = getRandomElement("scenario-commercial");
                pillarVerb = "craft";
                pillarAdj = "";
                embedImage =
                    "https://xn--dnhold-3ya.com/wp-content/uploads/2023/05/commerce.gif";
                break;
            case 1:
                scenarioString = getRandomElement("scenario-logistical");
                pillarVerb = "procure materials for";
                embedImage =
                    "https://xn--dnhold-3ya.com/wp-content/uploads/2023/05/logistical.gif";
                break;
            case 2:
                scenarioString = getRandomElement("scenario-martial");
                pillarVerb = "test out";
                embedImage =
                    "https://xn--dnhold-3ya.com/wp-content/uploads/2023/05/martial.gif";
                break;
            default:
                console.error(
                    "Couldn't assign a scenario, this shouldn't happen!"
                );
                return;
        }
    } else if (commercialRoles.some((roleId) => userRoles.has(roleId))) {
        // Grab a scenario from the commercial pool
        scenarioString = getRandomElement("scenario-commercial");
        pillarVerb = "craft";
        embedImage =
            "https://xn--dnhold-3ya.com/wp-content/uploads/2023/05/commerce.gif";
    } else if (logisticalRoles.some((roleId) => userRoles.has(roleId))) {
        // Grab a scenario from the logistical pool
        scenarioString = getRandomElement("scenario-logistical");
        pillarVerb = "procure materials for";
        embedImage =
            "https://xn--dnhold-3ya.com/wp-content/uploads/2023/05/logistical.gif";
    } else if (martialRoles.some((roleId) => userRoles.has(roleId))) {
        // Grab a scenario from the martial pool
        scenarioString = getRandomElement("scenario-martial");
        pillarVerb = "test out";
        embedImage =
            "https://xn--dnhold-3ya.com/wp-content/uploads/2023/05/martial.gif";
    } else {
        // User wasn't in any approved roles, send them a reply telling them to reach out to leadership to get permission to participate.
        interaction.reply({
            content: `Hail ${interaction.member.displayName}, I only assign commissions to members of Dünhold.`,
            ephemeral: true,
        });
        return;
    }

    // Roll type (e.g. armor)
    let commissionType = "";
    const rand = Math.floor(Math.random() * 6);
    switch (rand) {
        case 0:
            commissionType = "armor";
            break;
        case 1:
            commissionType = "jewelry";
            break;
        case 2:
            commissionType = "artifact";
            break;
        case 3:
            commissionType = "weapon";
            break;
        case 4:
            commissionType = "tool";
            break;
        case 5:
            commissionType = "instrument";
            break;
        default:
            console.error(
                "Couldn't assign an item type, this shouldn't happen!"
            );
            return;
    }

    // Roll sub-type (e.g. helmet)
    const subType = getRandomElement(commissionType);
    console.log(subType);

    // Roll metal (e.g. bronze)
    const metal = getRandomElement("metal");
    console.log(metal);

    // Roll wood (e.g. birch)
    const wood = getRandomElement("wood");
    console.log(wood);

    // Roll stone (e.g. basalt)
    const stone = getRandomElement("stone");
    console.log(stone);

    // Roll misc (e.g. linen)
    const misc = getRandomElement("misc");
    console.log(misc);

    // Roll gem (e.g. diamond)
    const gem = getRandomElement("gem");
    console.log(gem);

    // Roll enchant (e.g. bane)
    const enchant = getRandomElement("enchant");
    console.log(enchant);

    // Write a customized blob of text that references the user's rank, scenario, and item elements.
    let embedDescription =
        //"Customized blob of text pieced together by the below materials and some custom prompts.";
        "You have been commissioned to " +
        pillarVerb +
        " " +
        handleVowels(subType) +
        ", made from " +
        metal +
        ", " +
        wood +
        ", and " +
        stone +
        ". Adorned with " +
        handleVowels(gem) +
        " and upholstered with " +
        misc +
        ". Lastly ensure it has been enchanted with " +
        enchant +
        ". Good luck.";

    const embed = new EmbedBuilder()
        .setColor("DarkPurple")
        .setTitle("2023 Runeforge Expo")
        .setURL("https://dünhold.com")
        .setDescription(embedDescription)
        .setThumbnail(
            "https://xn--dnhold-3ya.com/wp-content/uploads/2023/05/Calgrim-the-Taskmaster.png"
        )
        .addFields({
            name: "Scenario",
            value: scenarioString,
            inline: false,
        })
        .addFields({
            name: "Item",
            value: subType,
            inline: true,
        })
        .addFields({
            name: "Metal",
            value: metal,
            inline: true,
        })
        .addFields({
            name: "Wood",
            value: wood,
            inline: true,
        })
        .addFields({
            name: "Stone",
            value: stone,
            inline: true,
        })
        .addFields({
            name: "Misc.",
            value: misc,
            inline: true,
        })
        .addFields({
            name: "Gem",
            value: gem,
            inline: true,
        })
        .addFields({
            name: "Enchant",
            value: enchant,
            inline: false,
        })
        .setImage(embedImage)
        .setTimestamp()
        .setFooter({
            text: "Dünhold LLC.",
            iconURL:
                "https://xn--dnhold-3ya.com/wp-content/uploads/2023/02/Dunhold_banner_logo.png",
        });

    interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
};

function getRandomElement(element) {
    const elementBuffer = fs.readFileSync(
        `./data/live/${element}.json`,
        "utf8"
    );
    const elementObj = JSON.parse(elementBuffer);
    const elementValues = Object.values(elementObj);
    const randomIndex = Math.floor(Math.random() * elementValues.length);
    const randomElementObj = elementValues[randomIndex].value;
    return JSON.stringify(randomElementObj).replace(/"/g, "");
}

function handleVowels(word) {
    let letter = word.charAt(0);

    if (
        letter === "a" ||
        letter === "e" ||
        letter === "i" ||
        letter === "o" ||
        letter === "u" ||
        letter === "A" ||
        letter === "E" ||
        letter === "I" ||
        letter === "O" ||
        letter === "U"
    ) {
        return "an " + word;
    } else {
        return "a " + word;
    }
}

export { create, DESCRIPTION, invoke, NAME };
