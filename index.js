const Discord = require("discord.js");
const client = new Discord.Client();
const createTypes = ["role", "channel", "invite"];

let currentGuild = null;
let currentChannel = null;

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

function checkArgs(args, requiredArgs) {
  if (args.length == requiredArgs) return true;
  else return false;
}

function checkArgsMinMax(args, minRequiredArgs, maxRequiredArgs) {
  if (args.length == minRequiredArgs || args.length == maxRequiredArgs)
    return true;
  else return false;
}

function invalidArgs(args, requiredArgs) {
  console.log(
    `That command requires ${requiredArgs} arguments, you gave ${args.length}!`
  );
  return main();
}

function invalidArgsWithOpts(args, requiredArgs, optArgs) {
  console.log(
    `That command requires ${requiredArgs} arguments and ${optArgs} optional arguments, you gave ${args.length} args!`
  );
  return main();
}

function login(token, callback) {
  client.login(token).catch(err => {
    console.error(err.message);
    return main();
  });
}

const clean = text => {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
};

function main() {
  readline.question("Action: ", async input => {
    const args = input.trim().split(" ");
    const command = args.shift();

    switch (command.toLowerCase()) {
      case "login":
        if (checkArgs(args, 1)) {
          login(args[0]);
        } else invalidArgs(args, 1);
        break;
      case "eval":
        try {
          const code = args.join(" ");
          let evaled = await eval(code);
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
          console.log(clean(evaled));
        } catch (error) {
          console.log(error.message);
        }
        return main();
      case "setguild":
        if (checkArgs(args, 1)) {
          // they gave a guild id
        } else {
          // they didnt give a guild id so show a selection menu
          let menuBody = "Select a guild to manage:\n";
          const guilds = [];
          client.guilds.forEach(guild => {
            guilds.push(guild.name);
          });
          guilds.filter(n => n);
          for (guild of guilds) {
            menuBody += `${guilds.indexOf(guild) + 1}. ${guild}\n`;
          }

          // print the menu
          console.log(menuBody);

          // TODO: Get selection
          // TODO: set current guild
          // TODO: channel selection
          // TODO: set current channel
        }
        break;
      case "createchannel":
        if (checkArgsMinMax(args, 1, 3)) {
          // TODO: Guild selection menu - number based
          return main();
        } else invalidArgsWithOpts(args, 1, 2);
        break;
      default:
        console.error("Invalid Command!");
        return main();
    }
  });
}
main();
