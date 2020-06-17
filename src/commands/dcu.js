const chalk = require("chalk");
const { spawn, exec } = require("child_process");
const { env_path, app_key } = process.env;
const uni = require("../uniLog");
const config = require("../config");
const servers = config.get("servers");

const grab = options => {
  let grab = options.keep ? "" : "--clean";
  if (grab == "--clean") {
    console.log(uni.info + " Clean grabb selected.");
  }
  // console.log("--grab", grab, "--node", env_path);
  console.log("📡  " + chalk.green("Locating Widgets..."));
  spawn(
    "dcu",
    ["--grab", grab, "--node", env_path, "--applicationKey", app_key],
    { stdio: "inherit" }
  );
};

const put = filePath => {
  let file = filePath.split("/");
  let fileName = file[file.length - 1];
  console.log("✏️  " + chalk.green("Updating [" + fileName + "] file..."));
  spawn(
    "dcu",
    ["--put", filePath, "--node", env_path, "--applicationKey", app_key],
    { stdio: "inherit" }
  );
};
const putAll = directoryPath => {
  let widget = directoryPath.split("/");
  let widgetName = widget[widget.length - 1];
  console.log("✏️  " + chalk.green("Updating [" + widgetName + "] widget..."));
  spawn(
    "dcu",
    [
      "--putAll",
      directoryPath,
      "--node",
      env_path,
      "--applicationKey",
      app_key
    ],
    { stdio: "inherit" }
  );
};
const refresh = directoryPath => {
  let widget = directoryPath.split("/");
  let widgetName = widget[widget.length - 1];
  console.log(
    "✏️  " + chalk.green("Refreshing [" + widgetName + "] widget...")
  );
  spawn(
    "dcu",
    [
      "--refresh",
      directoryPath,
      "--node",
      env_path,
      "--applicationKey",
      app_key
    ],
    { stdio: "inherit" }
  );
};

const transfer = ( filePath, options ) => {

  let file = filePath.split("/");
  let fileName = file[file.length - 1];
  console.log("✏️  " + chalk.green("Transfering [" + fileName + "] file... to " + options.destinationNode));
  spawn(
    "dcu",
    ["-r", filePath, "--node", servers[options.destinationNode].adminUrl, "--applicationKey", servers[options.destinationNode].applicationKey],
    { stdio: "inherit" }
  );
};

const transferAll = ( filePath, options ) => {

  let file = filePath.split("/");
  let fileName = file[file.length - 1];
  console.log("✏️  " + chalk.green("Transfering [" + fileName + "] file... to " + options.destinationNode));
  spawn(
    "dcu",
    ["--transferAll", filePath, "--node", servers[options.destinationNode].adminUrl, "--applicationKey", servers[options.destinationNode].applicationKey],
    { stdio: "inherit" }
  );
};

module.exports = { grab, put, putAll, refresh, transfer, transferAll };
