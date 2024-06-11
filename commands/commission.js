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
        "1117672388868456500", // garnetCrewman
        "1117672422926196887", // amethystSeadog
        "1117672452688986213", // sapphireSeafarer
        "1117672482099441764", // rubyMarshal
        "1117672512885620756", // jadedCaptain
        "1117672554446991390", // onyxAnchor
        "867286813453582366",  // diamondAdmiral
        "1111686289381654538", // toiler
        "1111686383027884042", // farmhand
        "1111686558584688731", // herdsman
        "1111686683331670076", // rancher
        "1111686731641651220", // keeper
        "1111688960675164260", // shepherd
        "1102057432634630265", // ramkeeper
        "1111341147235811368", // initiate
        "1111341199954026527", // apprentice
        "1111341248603758703", // journeydwarf
        "1111341304262168667", // glyphscribe
        "1111341449628373002", // runespeaker
        "1111341508818374777", // masterCrafter
        "1061118295442464778", // ascendantCraftsdwarf
    ];

    // All logistical roles - these users will get a scenario based on the overseeing of others
    const logisticalRoles = [
        "1117671868376297482", // tinRecruit
        "1117672118990151690", // copperPrivate
        "1117672150858481734", // bronzeSergeant
        "1117672184970752152", // silverLieutenant
        "1117672215547224134", // platinumCaptain
        "1117672257087610961", // palladiumMajor
        "867287695986524200", // masterOfGold
        "1111689837460848782", // merryMaker
        "1111689895874932786", // talespinner
        "1111690075948982354", // storyteller
        "1111690156769030277", // fabler
        "1111690221868818482", // proprietor
        "1111690291854987336", // brewmaster
        "1102057521037967441", // hearthmaven
        "1111338922111422545", // student
        "1111338956148187186", // librarian
        "1111339006253342831", // scholar
        "1111339309899989103", // historian
        "1111339366078496890", // archaeologist
        "1111339519204143285", // lorekeeper
        "1061118286756053052", // loremaster
    ];

    // All martial roles - these users will get a scenario based on the aquisition of materials
    const martialRoles = [
        "1117671462619336787", // ironRecruit
        "1117671595801071676", // ironSentinel
        "1117671634829066281", // ironLieutenant
        "1117671673735434291", // ironCaptain
        "1117671724314529853", // ironCommander
        "1117671797278654577", // ironBrigadier
        "867287109940543518",  // generalOfIron
        "1111342543649636515", // adventurer
        "1111342605188472863", // scout
        "1111342650818302003", // seeker
        "1111342701019942982", // outrider
        "1111342831932542976", // ranger
        "1111685579436982403", // slayer
        "1102057268104675359", // pathfinder
        "1111337619599671316", // acolyte
        "1111337778735751268", // missionary
        "1111337901117165749", // inquisitor
        "1111338068495061072", // exorcist
        "1111338279422406656", // crusader
        "1111338337744199751", // arbiter
        "1061118908918140958", // grandArbiter
    ];

    // All special roles
    const specialRoles = [
        "661017102680850432", // kin
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
