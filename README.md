![License](https://img.shields.io/github/license/VATSIM-CARIBBEAN/discord-bot)
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

    Copy the `.env.example` file to `.env` and fill in your credentials:

    ```bash
    cp .env.example .env
    ```

    Then edit the `.env` file with your actual values.

4. **Configure instance-specific values** (optional but recommended)

    Some values are hardcoded in the source files and should be updated for your organization:

    - **[local_library/vatsim_tracker.js:8](local_library/vatsim_tracker.js#L8)**: `CHANNEL_ID` - Discord channel ID for controller tracking notifications
    - **[commands/workflow/board.js:5-6](commands/workflow/board.js#L5-L6)**: `WORKFLOW_BOARD_THREAD_ID` and `WORKFLOW_BOARD_MESSAGE_ID` - Thread and message IDs for the workflow board
    - **[commands/workflow/_shared.js:67](commands/workflow/_shared.js#L67)**: `EXECUTIVE_ROLE_ID` - Discord role ID for executive team
    - **[commands/workflow/_shared.js:205](commands/workflow/_shared.js#L205)**: `LEADERSHIP_ROLE_IDS` - Set of Discord role IDs for leadership team
    - **[commands/embed.js:87](commands/embed.js#L87)**: Footer text in embed command (set to your organization name)
    - **[commands/workflow/_shared.js:250](commands/workflow/_shared.js#L250)**: Integration URL (update to your organization's URL)

5. **Deploy slash commands**

    ```bash
    node deploy-commands.js
    ```

6. **Start the bot**

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
