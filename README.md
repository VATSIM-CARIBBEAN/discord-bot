![License](https://img.shields.io/github/license/VATSIM-CARIBBEAN/discord-bot)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Discord.js Version](https://img.shields.io/badge/discord.js-v14-blue)

# VATCAR Discord Bot

A multi-guild Discord bot for the VATSIM Caribbean Division. A single bot process serves multiple Discord servers, with each guild's code isolated in its own folder for independent maintenance.

## Current Guilds

### VATCAR Main Server (`guilds/vatcar/`)
- **VATSIM Controller Tracking**: Real-time monitoring of 180+ ATC positions across Caribbean facilities
- **Custom Embed Command**: Administrator slash command to create and send formatted embeds

### San Juan / ZSU (`guilds/zsu/`)
- **Role Management**: Automatic VATSIM/VATCAR role sync via `/sync` command
- **Daily Roster Updates**: Scheduled bulk role sync for all guild members
- **Training Coordination**: Training availability posts, top-down support requests, training notes
- **Moderation Tools**: Anonymous DMs, autoresponder, member stats lookup

## Requirements
- Node.js v18 or later
- Discord.js v14
- MySQL Database (for VATCAR main)

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

3. **Configure environment variables**

    The bot uses separate `.env` files for shared and guild-specific configuration:

    ```bash
    # Shared config (bot token, client ID, heartbeat)
    cp .env.example .env

    # VATCAR guild config (guild ID, tracker channel, database)
    cp guilds/vatcar/.env.example guilds/vatcar/.env

    # ZSU guild config (guild ID, role IDs, API keys, roster schedule)
    cp guilds/zsu/.env.example guilds/zsu/.env
    ```

    Edit each `.env` file with your actual values. See the `.env.example` files for documentation on each variable.

4. **Enable Privileged Gateway Intents**

    In the [Discord Developer Portal](https://discord.com/developers/applications), enable these intents for your bot:
    - Server Members Intent (required for ZSU roster sync)
    - Presence Intent (required for ZSU)
    - Message Content Intent (required for ZSU autoresponder)

5. **Deploy slash commands**

    ```bash
    node deploy-commands.js
    ```

    This automatically deploys each guild's commands to its respective server.

6. **Start the bot**

    ```bash
    node index.js
    ```

## Architecture

```
discord-bot/
├── index.js                    # Multi-guild orchestrator
├── deploy-commands.js          # Per-guild command deployment
├── shared/                     # Guild-agnostic utilities
│   └── heartbeat.js
├── guilds/
│   ├── vatcar/                 # VATCAR main server
│   │   ├── index.js            # Guild module entry point
│   │   ├── commands/           # Slash commands
│   │   ├── services/           # Background services (tracker)
│   │   └── .env.example
│   └── zsu/                    # San Juan (ZSU) server
│       ├── index.js            # Guild module entry point
│       ├── commands/           # Slash commands
│       │   ├── Community/      # Community commands
│       │   └── Moderation/     # Staff commands
│       ├── functions/          # Background services (roster sync)
│       └── .env.example
```

Each guild module in `guilds/<name>/index.js` exports a standard contract:
- **`guildId`** — Which Discord server this module serves
- **`intents`/`partials`** — Required Discord intents (merged at startup)
- **`getCommands()`** — Slash commands to register for this guild
- **`onReady(client)`** — Start background services when bot connects
- **`onInteraction(interaction)`** — Handle interactions from this guild
- **`onShutdown()`** — Cleanup on bot shutdown

## Features Detail

### VATSIM Controller Tracking (VATCAR)
- Polls VATSIM data feed every 2 seconds
- Monitors 180+ positions across Caribbean facilities
- Sends embed when controller logs on (green)
- Updates embed when controller logs off (red) with session duration
- Handles position variations (e.g., `MKJK_I_CTR` → `MKJK_CTR`)
- State persisted to `guilds/vatcar/data/vatsim_state.json`

### Role Sync (ZSU)
- `/sync` — Manual sync: links Discord to VATSIM, assigns rating/controller roles, sets nickname
- `/synctest` — Staff command to test sync for a specific user
- Daily automated roster update: syncs all guild members with VATSIM/VATCAR APIs
- Built-in VATSIM API rate limiting (6 requests/minute)

### Training & Support (ZSU)
- `/training-availability` — Post training sessions with timezone support and auto-expiring messages
- `/top-down-support` — Request top-down ATC support with position selection
- `/check-notes` — View training notes for a student
- `/check-stats` — Quick link to VATSIM stats page

### Moderation (ZSU)
- `/dm` — Send anonymous DMs from administration
- `/autoresponder` — Set auto-responses to trigger phrases
- `/member-stats` — View user's VATSIM/VATCAR profile
- `/delete` — Delete last bot message

## Adding a New Guild

1. Create `guilds/<name>/` with `index.js`, `commands/`, and `.env.example`
2. Implement the guild module contract in `index.js`
3. Add `require('dotenv').config({ path: 'guilds/<name>/.env', override: false });` to root `index.js` and `deploy-commands.js`
4. Create the `.env` file on the server with guild-specific values
5. Run `node deploy-commands.js` and restart the bot

## Process Management

The bot is designed to run 24/7 using PM2:

```bash
pm2 start ecosystem.config.js
pm2 logs discord-bot
pm2 restart discord-bot
```

## Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys on push to `main`:
1. SSH into VPS
2. Pull latest code
3. Install dependencies (`npm ci`)
4. Deploy slash commands to all guilds
5. Restart via PM2

## Contributing

VATCAR main server code lives in `guilds/vatcar/` and ZSU code lives in `guilds/zsu/`. Each team can submit PRs to their respective folder without affecting the other guild's functionality.

## License

MIT License
