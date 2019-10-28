const Discord = require("discord.js");
const client = new Discord.Client();
const createTypes = ["role", "channel", "invite"];
const channelTypes = ["Text", "Voice"];

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

function selectGuild() {
  let menuBody = "Select a guild to manage:\n";
  const guilds = [];

  client.guilds.forEach(guild => {
    guilds.push(guild);
  });

  guilds.filter(n => n);
  for (guild of guilds) {
    menuBody += `${guilds.indexOf(guild) + 1}. ${guild.name}\n`;
  }

  // print the menu
  console.log(menuBody);

  // TODO: Sanitize input
  readline.question("Guild: ", ans => {
    if (guilds[ans - 1]) {
      currentGuild = guilds[ans - 1];
      console.log(`Current Guild set to: ${currentGuild.name}`);
      return main();
    } else {
      console.error("Invalid entry!");
      return main();
    }
  });
}

function logout() {
  client.destroy();
  process.exit(0);
}

function createChannel() {
  const channelObj = { type: "", topic: "", nsfw: "" };
  readline.question("Channel Name: ", name => {
    if (isText(name)) {
      let menuBody = "\nValid Types:\n";
      for (type of channelTypes) {
        menuBody += `${channelTypes.indexOf(type) + 1}. ${type}\n`;
      }
      console.log(menuBody);

      readline.question("Channel Type (Number): ", type => {
        if (isText(type)) {
          if (channelTypes.indexOf(type)) {
            channelObj.type = channelTypes[type - 1].toLowerCase();
            if (channelObj.type == "text") channelObj.name = name.toLowerCase();
            else channelObj.name = name;

            readline.question("Topic: ", topic => {
              if (isText(topic)) {
                channelObj.topic = topic;
                currentGuild
                  .createChannel(channelObj.name, {
                    type: channelObj.type,
                    topic: channelObj.topic
                  })
                  .then(v => {
                    console.log(`Channel Created! ID: ${v.id}`);
                    return main();
                  });
              } else {
                console.error("Invalid input!");
                return main();
              }
            });
          } else {
            console.error("Invalid type!");
            return main();
          }
        } else {
          console.error("Invalid input!");
          return main();
        }
      });
      return main();
    } else {
      console.error("Invalid input!");
      return main();
    }
  });
}

function isText(text) {
  if (text.trim()) return true;
  else return false;
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
          selectGuild();

          // TODO: Get selection
          // TODO: set current guild
          // TODO: channel selection
          // TODO: set current channel
        }
        break;
      case "createchannel":
        if (currentGuild) {
          createChannel();
        } else {
          console.log(
            "No guild set, please select a guild and rerun the command."
          );
          selectGuild();
        }
        return main();
      default:
        console.error("Invalid Command!");
        return main();
    }
  });
}
main();
