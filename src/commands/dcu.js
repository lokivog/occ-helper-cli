const chalk = require("chalk");
const { spawn, exec } = require("child_process");
const { env_path, app_key } = process.env;
const uni = require("../uniLog");
const config = require("../config");
const servers = config.get("servers");
var os = require('os');

function dcuCmd() {
  if(os.platform() === 'win32') {
    return "dcu.cmd";
  } else {
    return "dcu";
  }
}

function plcuCmd() {
  if(os.platform() === 'win32') {
    return "plsu.cmd";
  } else {
    return "plsu";
  }
}

const grab = options => {
  let grab = options.keep ? "" : "--clean";
  if (grab == "--clean") {
    console.log(uni.info + " Clean grabb selected.");
  }
  // console.log("--grab", grab, "--node", env_path);
  console.log("📡  " + chalk.green("Locating Widgets..."));
  spawn(
    dcuCmd(),
    ["--grab", grab, "--node", env_path, "--applicationKey", app_key],
    { stdio: "inherit" }
  );
};

const put = filePath => {
  let file = filePath.split("/");
  let fileName = file[file.length - 1];
  console.log("✏️  " + chalk.green("Updating [" + fileName + "] file..."));
  spawn(
    dcuCmd(),
    ["--put", filePath, "--node", env_path, "--applicationKey", app_key],
    { stdio: "inherit" }
  );
};
const putAll = directoryPath => {
  let widget = directoryPath.split("/");
  let widgetName = widget[widget.length - 1];
  console.log("✏️  " + chalk.green("Updating [" + widgetName + "] widget..."));
  spawn(
    dcuCmd(),
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
  dcuCmd();
  let widgetName = widget[widget.length - 1];
  console.log(
    "✏️  " + chalk.green("Refreshing [" + widgetName + "] widget...")
  );
  spawn(
    dcuCmd(),
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
    dcuCmd(),
    ["-r", filePath, "--node", servers[options.destinationNode].adminUrl, "--applicationKey", servers[options.destinationNode].applicationKey],
    { stdio: "inherit" }
  );
};

const transferAll = ( filePath, options ) => {

  let file = filePath.split("/");
  let fileName = file[file.length - 1];
  console.log("✏️  " + chalk.green("Transfering [" + fileName + "] file... to " + options.destinationNode));
  spawn(
    dcuCmd(),
    ["--transferAll", filePath, "--node", servers[options.destinationNode].adminUrl, "--applicationKey", servers[options.destinationNode].applicationKey],
    { stdio: "inherit" }
  );
};

const listLayouts = () => {
  console.log("List page layouts");
  
  spawn(
    "plsu",
    ["--list", "--node", env_path, "--applicationKey", app_key],
    { stdio: "inherit" }
  );
}

const transferLayout = ( filePath, options ) => {

  let file = filePath.split("/");
  let fileName = file[file.length - 1];
  console.log("✏️  " + chalk.green("Transfering [" + fileName + "] layout from " + options.fromNode + " to " + options.destinationNode));
  
  spawn(
    "plsu",
    ["--transfer", "--node", servers[options.fromNode].adminUrl, "--applicationKey", servers[options.fromNode].applicationKey, 
    "--destinationNode", servers[options.destinationNode].adminUrl, "--destinationApplicationKey", servers[options.destinationNode].applicationKey,
    "--name", fileName],
    { stdio: "inherit" }
  );
}

const transferAllLayouts = (options) => {

  console.log("✏️  " + chalk.green("Transfering all layouts from " + options.fromNode + " to " + options.destinationNode));
  
  spawn(
    "plsu",
    ["--transfer", "--node", servers[options.fromNode].adminUrl, "--applicationKey", servers[options.fromNode].applicationKey, 
    "--destinationNode", servers[options.destinationNode].adminUrl, "--destinationApplicationKey", servers[options.destinationNode].applicationKey,
    "--all"],
    { stdio: "inherit" }
  );
}

module.exports = { grab, put, putAll, refresh, transfer, transferAll, listLayouts, transferLayout, transferAllLayouts };
