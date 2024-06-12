import {} from "dotenv/config";
import fs from "fs";
import { Client, GatewayIntentBits } from "discord.js";

// Create a new Client with the Guilds intent
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

// Fetch all js files in ./events
const events = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

// Check for an event and execute the corresponding file in ./events
for (let event of events) {
    // The #events ES6 import-abbreviation is defined in the package.json
    // Note that the entries in the list of files (created by readdirSync) end with .js,
    // so the abbreviation is different to the #commands abbreviation
    const eventFile = await import(`#events/${event}`);
    // But first check if it's an event emitted once
    if (eventFile.once)
        client.once(eventFile.name, (...args) => {
            eventFile.invoke(...args);
        });
    else
        client.on(eventFile.name, (...args) => {
            eventFile.invoke(...args);
        });
}

// Setup data directories if not already setup
const createDirectoryIfNotExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};
createDirectoryIfNotExists("./data/live");
createDirectoryIfNotExists("./data/merges");
createDirectoryIfNotExists("./data/staged");
createDirectoryIfNotExists("./data/trash");

const requiredVariables = [
    "GUILD_ID",
    "IGC1",
    "IGC2",
    "IGC3",
    "IGC4",
    "IGC5",
    "IGC6",
    "IGC7",
    "RAC1",
    "RAC2",
    "RAC3",
    "RAC4",
    "RAC5",
    "RAC6",
    "RAC7",
    "RUC1",
    "RUC2",
    "RUC3",
    "RUC4",
    "RUC5",
    "RUC6",
    "RUC7",
    "IGL1",
    "IGL2",
    "IGL3",
    "IGL4",
    "IGL5",
    "IGL6",
    "IGL7",
    "RAL1",
    "RAL2",
    "RAL3",
    "RAL4",
    "RAL5",
    "RAL6",
    "RAL7",
    "RUL1",
    "RUL2",
    "RUL3",
    "RUL4",
    "RUL5",
    "RUL6",
    "RUL7",
    "IGM1",
    "IGM2",
    "IGM3",
    "IGM4",
    "IGM5",
    "IGM6",
    "IGM7",
    "RAM1",
    "RAM2",
    "RAM3",
    "RAM4",
    "RAM5",
    "RAM6",
    "RAM7",
    "RUM1",
    "RUM2",
    "RUM3",
    "RUM4",
    "RUM5",
    "RUM6",
    "RUM7",
    "KIN",
    "THANE",
    "HIGHTHANE",
    "IRONGUARD",
    "RAMHEART",
    "RUNEFORGE",
    "AUTHORIZED_ADMINS",
    "TOKEN",
];

const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
    console.error(
        `Missing environment variables: ${missingVariables.join(", ")}`
    );
    process.exit(1);
}

// Login with the environment data
if (process.env.TOKEN === "") {
    console.error(
        "You need to provide a bot token value for TOKEN in your Docker compose file, or run command."
    );
    process.exit(1);
} else {
    client.login(process.env.TOKEN);
}
