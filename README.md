![License](https://img.shields.io/github/license/VATSIM-CARIBBEAN/Discord-Bot)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Discord.js Version](https://img.shields.io/badge/discord.js-v14-blue)

# VATCAR Discord Bot

A Discord bot for administrative tasks in the VATSIM Caribbean Division’s Discord server.  
Currently, it is used for **workflow automation** to manage and approve change requests between leadership, staff, and technical teams.

## Current Features
- **Workflow Automation**: Multi-step approval process with role-based permissions and decision buttons.

## Requirements
- Node.js v18 or later
- Discord.js v14
- MySQL Database

## Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/VATSIM-CARIBBEAN/Discord-Bot.git
    cd Discord-Bot
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Create the `.env` file** in the project root with your credentials:

    ```env
    CLIENT_ID=your_discord_application_client_id
    BOT_TOKEN=your_discord_bot_token
    GUILD_ID=your_guild_id

    VATCAR_DIVISION_KEY=your_internal_division_key

    DB_HOST=your_mysql_host
    DB_PORT=3306
    DB_DATABASE=your_mysql_database
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    ```

4. **Start the bot**

    ```bash
    node index.js
    ```

You can use process manager on a virtual machine to keep your bot running 24/7. Oracle offers a 24/7 free tier virtual machine which you can set up.

## Updating 

If you have set up the bot on an ubuntu virtual machine such as Oracle, you can pull the latest update by running the following commands:

```bash
cd ~/Discord-Bot
git pull
npm ci
pm2 restart discord-bot # if you use process manager
```

## Planned Features

## License
MIT License