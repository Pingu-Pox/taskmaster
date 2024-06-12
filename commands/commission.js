import { SlashCommandSubcommandBuilder, EmbedBuilder } from "discord.js";
import {} from "dotenv/config";
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
        process.env.IGC1,
        process.env.IGC2,
        process.env.IGC3,
        process.env.IGC4,
        process.env.IGC5,
        process.env.IGC6,
        process.env.IGC7,
        process.env.RAC1,
        process.env.RAC2,
        process.env.RAC3,
        process.env.RAC4,
        process.env.RAC5,
        process.env.RAC6,
        process.env.RAC7,
        process.env.RUC1,
        process.env.RUC2,
        process.env.RUC3,
        process.env.RUC4,
        process.env.RUC5,
        process.env.RUC6,
        process.env.RUC7,
    ];
    console.log("Outputting Commercial Role IDs: \n");
    commercialRoles.forEach(value => {
        console.log(value);
    });

    // All logistical roles - these users will get a scenario based on the overseeing of others
    const logisticalRoles = [
        process.env.IGL1,
        process.env.IGL2,
        process.env.IGL3,
        process.env.IGL4,
        process.env.IGL5,
        process.env.IGL6,
        process.env.IGL7,
        process.env.RAL1,
        process.env.RAL2,
        process.env.RAL3,
        process.env.RAL4,
        process.env.RAL5,
        process.env.RAL6,
        process.env.RAL7,
        process.env.RUL1,
        process.env.RUL2,
        process.env.RUL3,
        process.env.RUL4,
        process.env.RUL5,
        process.env.RUL6,
        process.env.RUL7,
    ];
    console.log("Outputting Logistical Role IDs: \n");
    logisticalRoles.forEach(value => {
        console.log(value);
    });

    // All martial roles - these users will get a scenario based on the aquisition of materials
    const martialRoles = [
        process.env.IGM1,
        process.env.IGM2,
        process.env.IGM3,
        process.env.IGM4,
        process.env.IGM5,
        process.env.IGM6,
        process.env.IGM7,
        process.env.RAM1,
        process.env.RAM2,
        process.env.RAM3,
        process.env.RAM4,
        process.env.RAM5,
        process.env.RAM6,
        process.env.RAM7,
        process.env.RUM1,
        process.env.RUM2,
        process.env.RUM3,
        process.env.RUM4,
        process.env.RUM5,
        process.env.RUM6,
        process.env.RUM7,
    ];
    console.log("Outputting Martial Role IDs: \n");
    martialRoles.forEach(value => {
        console.log(value);
    });

    // All special roles
    const specialRoles = [
        process.env.KIN, // kin
        process.env.THANE, // thane
        process.env.HIGHTHANE, // matriarch
    ];
    console.log("Outputting Special Role IDs: \n");
    specialRoles.forEach(value => {
        console.log(value);
    });

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

    // Commission ran
    console.log(`${interaction.member.displayName} ran /commission`);

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
    let embedDescription;

    if (
        subType === "N/A" ||
        metal === "N/A" ||
        wood === "N/A" ||
        stone === "N/A" ||
        misc === "N/A" ||
        gem === "N/A" ||
        enchant === "N/A"
    ) {
        embedDescription =
            //"We had a missing element, commission could not be completed.";
            'Your commission could not be generated due to missing pool data, check below for any pools reporting "N/A" and make sure to get live data merged in for it.';
    } else {
        embedDescription =
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
    }

    const embed = new EmbedBuilder()
        .setColor("DarkPurple")
        .setTitle("Runeforge Expo 2024")
        .setURL("https://library.dünhold.com/en/events/runeforge-expo")
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
                "https://xn--dnhold-3ya.com/wp-content/uploads/2023/08/Dunhold-Logo-copywrite.png",
        });

    interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
};

function getRandomElement(element) {
    let elementBuffer;
    try {
        elementBuffer = fs.readFileSync(`./data/live/${element}.json`, "utf8");
    } catch (error) {
        if (error.code === "ENOENT") {
            // Handle the file not found error
            console.error(error);
            return "N/A";
        } else {
            // Handle other types of errors
            console.error(error);
            return "An error occurred.";
        }
    }

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
