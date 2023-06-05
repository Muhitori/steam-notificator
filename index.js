import { Client, Events, Partials, GatewayIntentBits } from "discord.js";
import SteamUser from "steam-user";

const { TARGET_ID, MESSAGE, DISCORD_TOKEN, STEAM_USERNAME, STEAM_PASSWORD } =
	process.env;

const steamClient = new SteamUser();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
	],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

steamClient.logOn({
	accountName: STEAM_USERNAME,
	password: STEAM_PASSWORD,
});

steamClient.on("friendMessageEcho", async (steamID, message) => {
	console.log(`Sent message to ${steamID}: ${message}`);

	const user = await client.users.fetch(TARGET_ID);
	await user.send(MESSAGE).catch((err) => {});
});

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(DISCORD_TOKEN);
