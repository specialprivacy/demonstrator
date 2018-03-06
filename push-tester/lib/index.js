require('app-module-path').addPath(`${__dirname}/../`)
let log = require('lib/utils/log')
log.info('Initializing server')

let app = require('lib/app')
const PORT = process.env.PORT || 80

// Start the server
let server = app.listen(PORT, () => {
  log.info(`Server started listening on port ${PORT}`)
})

// Handle SIGTERM gracefully
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGHUP', gracefulShutdown)

function gracefulShutdown () {
  // Serve existing requests, but refuse new ones
  log.warn('Received signal to terminate: wrapping up existing requests')
  server.close(() => {
    // Exit once all existing requests have been served
    log.warn('Received signal to terminate: done serving existing requests. Exiting')
    process.exit(0)
  })
}
