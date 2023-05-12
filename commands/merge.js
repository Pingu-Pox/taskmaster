import { SlashCommandSubcommandBuilder, PermissionsBitField } from "discord.js";
import fs from "fs";
import path from "path";

const NAME = "merge";
const DESCRIPTION = "Merges the staged pools into the live pools.";

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
    const command = new SlashCommandSubcommandBuilder()
        .setName(NAME)
        .setDescription(DESCRIPTION);

    return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    const stagedFilesDirectory = "./data/staged";
    const liveFilesDirectory = "./data/live";

    // Read the list of staged files in the directory
    let stagedFiles = fs.readdirSync(stagedFilesDirectory);

    stagedFiles.forEach((stagedFile) => {
        const stagedFilePath = `${stagedFilesDirectory}/${stagedFile}`;
        const liveFilePath = `${liveFilesDirectory}/${stagedFile}`;

        let liveData = {};

        // Check if the live file exists
        if (fs.existsSync(liveFilePath)) {
            // Read the contents of the live file
            const liveFileContent = fs.readFileSync(liveFilePath, "utf8");

            // Parse the live file content
            try {
                liveData = JSON.parse(liveFileContent);
            } catch (error) {
                console.error("Error parsing live file content:", error);
                return;
            }
        }

        // Read the contents of the staged file
        fs.readFile(stagedFilePath, "utf8", (err, stagedData) => {
            if (err) {
                console.error(`Error reading staged file ${stagedFile}:`, err);
                return;
            }

            let mergedData = {};

            try {
                const stagedJson = JSON.parse(stagedData);
                mergedData = { ...liveData, ...stagedJson };
            } catch (error) {
                console.error(
                    `Error parsing staged file ${stagedFile} content:`,
                    error
                );
                return;
            }

            // Convert the merged data to JSON string
            const mergedJson = JSON.stringify(mergedData, null, 2);

            // Write the merged data to the live file
            fs.writeFile(liveFilePath, mergedJson, "utf8", (err) => {
                if (err) {
                    console.error(
                        `Error writing to live file ${stagedFile}:`,
                        err
                    );
                    return;
                }

                console.log(
                    `Merged data from ${stagedFile} has been appended to the live file.`
                );
            });
        });
    });

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const dateTimeString = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

    const sourceDirectory = "./data/staged";
    const destinationDirectory = `./data/merges/${dateTimeString}`;

    // Read the list of files in the source directory
    fs.readdir(sourceDirectory, (err, files) => {
        if (err) {
            console.error("Error reading source directory:", err);
            return;
        }

        // Create the destination directory if it doesn't exist
        if (!fs.existsSync(destinationDirectory)) {
            fs.mkdirSync(destinationDirectory, { recursive: true });
        }

        // Iterate over each file
        files.forEach((file) => {
            // Check if the file is a JSON file
            if (path.extname(file) === ".json") {
                const sourcePath = path.join(sourceDirectory, file);
                const destinationPath = path.join(destinationDirectory, file);

                // Copy the file to the destination directory
                fs.copyFile(sourcePath, destinationPath, (err) => {
                    if (err) {
                        console.error(`Error copying file ${file}:`, err);
                    } else {
                        console.log(`File ${file} copied successfully.`);

                        // Delete the source file
                        fs.unlink(sourcePath, (err) => {
                            if (err) {
                                console.error(
                                    `Error deleting source file ${file}:`,
                                    err
                                );
                            } else {
                                console.log(`Source file ${file} deleted.`);
                            }
                        });
                    }
                });
            }
        });
    });

    interaction.reply({
        content:
            "You have finalized pending elements, they will now show up in new commissions.",
        ephemeral: true,
    });
};

export { create, DESCRIPTION, invoke, NAME };
