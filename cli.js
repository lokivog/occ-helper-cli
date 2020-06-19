#!/usr/bin/env node

const occ = require("commander");
const chalk = require("chalk");

const { init } = require("./src/commands/init");
const { createEnv } = require("./src/creator");
const envCmd = require("./src/commands/env");
const dcu = require("./src/commands/dcu");
const { version } = require("./package.json");

require("dotenv").config();
const pkgName = "Oracle Commerce Cloud Helper CLI";

occ.version(version).description(pkgName + " " + version);

occ
  .command("init")
  .option(
    "-c",
    "--clean",
    "Deletes all local files that have been previously downloaded."
  )
  .alias("i")
  .description("Start new OCC development workspace")
  .action(() => {
    process.stdout.write("\033]0;" + "occ init" + "\007");
    console.clear();
    console.log(chalk.blue(pkgName + " " + version));
    init();
  });

occ
  .command("putAll <directory>")
  .alias("pa")
  .description(
    "Sends all the files underneath a named directory back to the specified Commerce Cloud server."
  )
  .action(directoryPath => dcu.putAll(directoryPath));
occ
  .command("put <file>")
  .alias("p")
  .description(
    "Sends the contents of a single file back to the specified Commerce Cloud server."
  )
  .action(filePath => dcu.put(filePath));
occ
  .command("refresh <directory>")
  .alias("r")
  .description(
    "Refreshes content from the Commerce Cloud instance within the specified directory."
  )
  .action(directoryPath => {
    dcu.refresh(directoryPath);
  });
occ
  .command("grab [options]")
  .alias("g")
  .description(
    "Copy all available content from the Commerce Cloud instance to the base directory."
  )
  .option(
    "-c, --clean",
    "[default] Deletes all local files that have been previously downloaded."
  )
  .option(
    "-nc, --keep",
    "Keep all local files that have been previously downloaded and add new files created."
  )
  .action((dir, options) => {
    let opts = { clean: false, keep: false };
    opts = options.clean ? { clean: true, keep: false } : opts;
    opts = options.keep ? { clean: false, keep: true } : opts;
    dcu.grab(opts);
  });
occ
  .command("env")
  .description("View environment credentials")
  .action(() => envCmd());
occ
  .command("transfer <file>")
  .alias("t")
  .description(
    "Transfer the contents of a single file to a destination server. [options|dev,test,stage,prod] -d <env>"
  )
  .requiredOption(
    "-d, --destinationNode <env>",
    "destination node to transfer files to, options are [dev, test, stage, prod]"
  )
  .action( function(filePath, options) {
    dcu.transfer(filePath,options);
  })
occ
  .command("transferAll <dir>")
  .alias("ta")
  .description(
    "Transfer the contents of a directory to a destination server. [options|dev,test,stage,prod] -d <env>"
  )
  .requiredOption(
    "-d, --destinationNode <env>",
    "destination node to transfer files to, options are [dev, test, stage, prod]"
  )
  .action( function(filePath, options) {
    dcu.transferAll(filePath,options);
  })

occ
  .command("listLayouts")
  .alias("list")
  .description(
    "This lists all of the page layouts available on the system."
  )
  .action(function() {
    dcu.listLayouts();
  })

occ
  .command("transferLayout <layout>")
  .alias("tl")
  .description(
    "Transfers a layout from a source env to a destination env [options|dev,test,stage,prod] -f <fromEnv> -d <toEnv>"
  )
  .requiredOption(
    "-f, --fromNode <env>",
    "source node to transfer files from, options are [dev, test, stage, prod]"
  )
  .requiredOption(
    "-d, --destinationNode <env>",
    "destination node to transfer files to, options are [dev, test, stage, prod]"
  )
  .action( function(filePath, options) {
    dcu.transferLayout(filePath,options);
  })

occ
  .command("transferAllLayouts")
  .alias("tal")
  .description(
    "Transfers ALL Layouts from a source env to a destination env [options|dev,test,stage,prod] -f <fromEnv> -d <toEnv>"
  )
  .requiredOption(
    "-f, --fromNode <env>",
    "source node to transfer files from, options are [dev, test, stage, prod]"
  )
  .requiredOption(
    "-d, --destinationNode <env>",
    "destination node to transfer files to, options are [dev, test, stage, prod]"
  )
  .action( function(filePath, options) {
    dcu.transferAllLayouts(filePath,options);
  })

occ.parse(process.argv);
