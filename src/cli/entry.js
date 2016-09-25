#!/usr/bin/env node

'use strict'


const program = require('commander')
const commands = require('./commands/commands.js')
const LightBlueSDK = require('../lightblue.js')
const winston = require('winston')
const logging = require('../util/logs')
const platform = require('../util/platform')
const pkg = require('../../package.json')


function initSdk(logLevel='error') {
  // We want the SDK to be as silent as possible from the CLI, hence error level
  let loggingOpts = {
    level: logLevel,
    transports: [
      new (winston.transports.Console)({
        timestamp: logging.timestamp,
        formatter: logging.formatter,
      })
    ]
  }
  return new LightBlueSDK(loggingOpts)
}


function quit(rc, message) {
  console.log(message)
  process.exit(rc)
}


function commandComplete(error) {
  if (error) {
    quit(1, `${platform.lineEnding()}${error}`)
  } else {
    quit(0, `${platform.lineEnding()}Command completed successfully`)
  }
}


program
  .version(pkg.version)
  .option('-v, --version', 'Get SDK version')
  .action((options)=> {
    // Default handler
    console.log('Invalid command.')
    program.help()
  })


program
  .command('scan')
  .description('Scan for LightBlue devices')
  .action((options)=> {
    commands.startScan(initSdk(), commandComplete)
  })


program
  .command('program_firmware')
  .description('Program bean firmware')
  .option('-n, --name [name]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .action((options)=> {
    console.log('')
    commands.programFirmware(initSdk('info'), options.name, options.address, commandComplete)
  })


program
  .command('program_sketch [sketch_name]')
  .description('Program a single sketch to the Bean')
  .option('-n, --name [name]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .option('-o, --oops', 'Aids in reprogramming a malicious sketch')
  .action((sketchName, options)=> {
    console.log('')
    commands.programSketch(initSdk('info'), sketchName, options.name, options.address, options.oops, commandComplete)
  })


program
  .command('blink_led')
  .description('Blink on-board Bean LED')
  .option('-n, --name [name]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .action((options)=> {
    commands.blinkLed(initSdk(), options.name, options.address, commandComplete)
  })


program
  .command('rename [new_name]')
  .description('Rename Bean')
  .option('-n, --name [name]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .action((newName, options)=> {
    commands.rename(initSdk(), newName, options.name, options.address, commandComplete)
  })


program
  .command('read_accel')
  .description('Read accelerometer data')
  .option('-n, --name [name]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .action((options)=> {
    commands.readAccel(initSdk(), options.name, options.address, commandComplete)
  })


program
  .command('read_ble_config')
  .description('Read BLE config')
  .option('-n, --name [bean]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .action((options)=> {
    commands.readConfig(initSdk(), options.name, options.address, commandComplete)
  })


program
  .command('read_device_info')
  .description('Read Device Information')
  .option('-n, --name [bean]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .action((options)=> {
    commands.readDeviceInfo(initSdk(), options.name, options.address, commandComplete)
  })


program
  .command('install_bean_arduino_core')
  .description('Installs Bean Arduino core (https://github.com/punchthrough/bean-arduino-core)')
  .action((options)=> {
    commands.installBeanArduinoCore(commandComplete)
  })


program
  .command('list_compiled_sketches')
  .option('-c, --clean', 'Delete all compiled sketches')
  .description('Lists compiled sketches (/homedir/.beansketches)')
  .action((options)=> {
    commands.listCompiledSketches(options.clean, commandComplete)
  })


program
  .command('log_serial')
  .description('Log any serial output from the Bean')
  .option('-n, --name [bean]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .action((options)=> {
    commands.logSerial(initSdk(), options.name, options.address, commandComplete)
  })


program
  .command('send_serial [data]')
  .description('Send serial data to the Bean (default ascii)')
  .option('-n, --name [bean]', 'Bean name')
  .option('-a, --address [address]', 'Bean address')
  .option('-b, --binary', 'Interpret data as hex digits')
  .action((data, options)=> {
    commands.sendSerial(initSdk(), data, options.binary, options.name, options.address, commandComplete)
  })


if (!process.argv.slice(2).length) {
  console.log("Please provide a command as the first argument.")
  program.help()
}


program.parse(process.argv)
