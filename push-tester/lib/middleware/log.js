let log = require('lib/utils/log')
let uuid = require('uuid')

/**
 * Creates an ID for the request and sets up a logger for each request
 */
function addChildLogger (req, res, next) {
  req.requestId = req.headers['x-request-id'] ? req.headers['x-request-id'] : uuid.v4()
  req.log = log.child({requestId: req.requestId})
  req.log.info({req}, 'API Request')
  res.set('x-request-id', req.requestId)
  res.on('finish', () => req.log.debug({res}, 'API Response'))
  next()
}

module.exports = addChildLogger
