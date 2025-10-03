![License](https://img.shields.io/github/license/VATSIM-CARIBBEAN/Discord-Bot)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Discord.js Version](https://img.shields.io/badge/discord.js-v14-blue)

# VATCAR Discord Bot

A Discord bot for administrative tasks in the VATSIM Caribbean Division's Discord server.

## Current Features
- **Workflow Automation**: Multi-step approval process with role-based permissions and decision buttons
- **VATSIM Controller Tracking**: Real-time monitoring of controllers logging on/off positions with automatic Discord notifications
- **Custom Embed Command**: Administrator slash command to create and send formatted embeds to any channel

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
    FORUM_CHANNEL_ID=your_workflow_forum_channel_id

    VATCAR_DIVISION_KEY=your_internal_division_key

    DB_HOST=your_mysql_host
    DB_PORT=3306
    DB_DATABASE=your_mysql_database
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password

    BETTERSTACK_HEARTBEAT_URL=your_heartbeat_url_optional
    BETTERSTACK_HEARTBEAT_INTERVAL_MS=60000
    ```

4. **Deploy slash commands**

    ```bash
    node deploy-commands.js
    ```

5. **Start the bot**

    ```bash
    node index.js
    ```

You can use a process manager on a virtual machine to keep your bot running 24/7. Oracle offers a free tier virtual machine which you can set up.

A Heroku Procfile is included for those who wish to use Heroku. You must disable web and enable worker for a 24/7 runtime.

## Features Detail

### Workflow Automation
Multi-phase approval system for change requests with automatic thread tracking, role-based permissions, and status updates.

### VATSIM Controller Tracking
- Polls VATSIM data feed every 2 seconds
- Monitors 180+ positions across Caribbean facilities
- Sends embed when controller logs on (green)
- Updates embed when controller logs off (red) with session duration
- Handles position variations (e.g., `MKJK_I_CTR` → `MKJK_CTR`)

### Embed Command
Administrator-only slash command `/embed` to create custom embeds:
- Channel selection (text/announcement channels only)
- Title and description with `\n` parsing for newlines
- Color options: Blue, Green, Gray
- Optional image and clickable URL
- Optional @everyone mention

## Updating 

If you have set up the bot on an Ubuntu virtual machine such as Oracle, you can pull the latest update by running:

```bash
cd ~/Discord-Bot
git pull
npm ci
node deploy-commands.js  # Only needed if slash commands changed
pm2 restart discord-bot  # If using process manager
```

## License
MIT License