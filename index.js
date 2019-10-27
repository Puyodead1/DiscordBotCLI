const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(
    `Logged in as ${client.user.username}; Serving ${client.guilds.size} guilds and ${client.users.size} users.`
  );
  return main();
});

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

function login(token, callback) {
  client.login(token).catch(err => {
    console.error(err.message);
    return main();
  });
}

function main() {
  readline.question("Action: ", input => {
    const args = input.trim().split(" ");
    const command = args.shift();

    switch (command.toLowerCase()) {
      case "login":
        login(args[0]);
        break;
    }
  });
}
main();
