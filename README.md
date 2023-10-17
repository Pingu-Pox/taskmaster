## Taskmaster

This Discord bot facilitates the Runeforge Expo, with commands enabling users to add/edit/remove elements that comprise a randomized commission.

### About

The bot utilizes many lists of elements, known as pools. These pools can be modified via the /add and /remove commands.

### Usage

To use the bot, follow these steps:

1. Obtain a Discord Bot Token:
   Visit Discord Developer Portal and create a new application. Then, set up a bot user and obtain the token. Save this to a notepad temporarily.

2. (Optional) Obtain your Discord server's server ID:
   Enable Discord Developer Mode, navigate to your Discord server, right-click the server icon, select "Copy Server ID". Save this to a notepad temporarily.

3. Docker Compose:
   Use the provided Docker Compose file to easily set up and run the bot in a Docker container.

4. Invite the bot to your server:
   Replace CLIENT_ID with your application's Client ID in the link below, the browse to it.
   https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=2048&scope=bot

```
version: '3'
services:
  taskmaster:
    container_name: taskmaster
    image: pingupox/taskmaster:latest
    environment:
      # Optional guild ID for local command registration, typically only used for development
      - GUILD_ID=
      # Bot token, obtained from https://discord.com/developers when creating a bot user
      - TOKEN=
    volumes:
      - ./data:/usr/src/app/data
    restart: always

```

Run the bot using `docker-compose up -d`. I suggest setting up your system to auto-launch the bot so it can be left unattended. Optionally use Watchtower to have Taskmaster update automatically when a new image is pushed to the Docker hub, or simply restart the Docker container every now and then to get updates.

## Contributing

Feel free to contribute by creating issues or submitting pull requests. Follow the guidelines in CONTRIBUTING.md for more details.

## License

This project is licensed under the MIT License.
