const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const STAFF_ROLE_NAME = "Staff Team";

client.once("ready", () => {
  console.log("Ticket Assistant Bot Online: " + client.user.tag);
});

client.on("channelCreate", async (channel) => {

  if (!channel.name) return;

  if (channel.name.startsWith("ticket-")) {

    const embed = new EmbedBuilder()
      .setTitle("Ticket Assistant")
      .setDescription(`Please explain why you opened this ticket.

If you are applying for content creator, type: cc
If you are applying for staff, type: staff`);

    channel.send({ embeds: [embed] });

  }

});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;
  if (!message.guild) return;

  if (!message.channel.name.startsWith("ticket-")) return;

  const msg = message.content.toLowerCase();

  if (msg === "cc") {

    message.channel.send(`Content Creator Application

Please provide the following information.

Platform (YouTube, TikTok, Twitch, etc)
Channel link
Number of followers or subscribers
Type of content you create
How often you upload`);

    return;

  }

  if (msg === "staff") {

    message.channel.send(`Staff Application

Please answer the following questions.

Age
Why you want to become staff
Previous staff experience
How active you are each day
Why we should choose you`);

    return;

  }

  const role = message.guild.roles.cache.find(
    r => r.name === STAFF_ROLE_NAME
  );

  if (!role) return;

  const embed = new EmbedBuilder()
    .setTitle("Ticket Message")
    .addFields(
      { name: "User", value: message.author.tag },
      { name: "Ticket", value: message.channel.name },
      { name: "Message", value: message.content }
    )
    .setTimestamp();

  role.members.forEach(member => {
    member.send({ embeds: [embed] }).catch(() => {});
  });

});

client.login(process.env.TOKEN);
