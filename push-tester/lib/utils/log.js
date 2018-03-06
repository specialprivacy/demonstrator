let bunyan = require('bunyan')
let fs = require('fs')
let os = require('os')
let pjson = require('package.json')

const levels = ['debug', 'info', 'warn', 'error', 'fatal']

const hostname = fs.existsSync('/etc/host_hostname')
  ? fs.readFileSync('/etc/host_hostname')
  : os.hostname()

let log = bunyan.createLogger({
  src: process.env.NODE_ENV !== 'production',
  name: pjson.name,
  serverVersion: pjson.version,
  hostname,
  level: levels.includes(process.env.LOGGING_LEVEL) ? process.env.LOGGING_LEVEL : 'info',
  serializers: bunyan.stdSerializers
})

module.exports = log
