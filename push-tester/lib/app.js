let app = require('express')()
let childLogger = require('lib/middleware/log')
let cors = require('cors')
let RandomStream = require('lib/utils/random-stream')

const {NO_CONTENT, OK} = require('http-status-codes')

app.disable('x-powered-by')
app.enable('trust proxy')
app.use(cors())
app.use(childLogger)

app.get('/connect', (req, res, next) => {
  res.status(OK)
  res.set('content-type', 'text/event-stream')
  const emitter = new RandomStream(req.log)
  emitter.pipe(res)
  req.on('close', () => {
    req.log.info('Terminating request')
    emitter.terminate()
  })
  req.on('end', () => {
    req.log.info('Terminating request')
    emitter.terminate()
  })
})

app.post('/push', (req, res, next) => {
  res.status(NO_CONTENT).send({statusCode: NO_CONTENT})
})

module.exports = app
