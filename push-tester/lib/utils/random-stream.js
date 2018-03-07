const {Readable} = require('stream')
const sse = require('sse-utils')
const uuid = require('uuid')

class RandomStream extends Readable {
  constructor (log) {
    super({ objectMode: true })
    this._log = log
    this.isTerminated = false
  }

  terminate () {
    this.isTerminated = true
    clearInterval(this.looper)
  }

  _read () {
    if (this.isTerminated) return this.push(null)
    if (!this.looper) {
      this.looper = setInterval(() => {
        const message = sse.stringify({
          data: {
              data: [{
                attributes : {
                  status: "status",
                  log: "event b complied",
                  policy: "Policy number 1",
                  timestamp: Date.now().toString(),
                },
                id: uuid.v4(),
                type: "reports"
            }]
          }
        })
        this._log.info(`sending message: ${JSON.stringify(message)}`)
        if (!this.isTerminated) this.push(message)
      }, 10000)
    }
  }
}

module.exports = RandomStream
