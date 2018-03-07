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

        const event = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random()*26)];
        const status = ['ok', 'error'][Math.floor(Math.random()*2)];
        const user = '0123456789'.split('')[Math.floor(Math.random()*10)] +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random()*26)] +
            '0123456789'.split('')[Math.floor(Math.random()*10)] +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random()*26)];
        const policy = "Policy " +
            '0123456789'.split('')[Math.floor(Math.random()*10)] +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random()*26)];
        var log = `Event ${event} complied`;
        if(status === "error") {
          // event A did not comply with the policy set by user U
          log = `Event ${event} did not comply with the policy set by user ${user}`;
        }

        // the two data keys are important
        // inside the second data, you should have an array of jsonapi complient data
        // the type has to be the "reports", because ember expects a report model
        //   {
        //     attributes : {
        //       attribute_key: attribute_value,
        //       attribute_key2: attribute_value2
        //     },
        //     id: uuid.v4(),
        //     type: "reports"
        // }

        const message = sse.stringify({
          data: {
              data: [{
                attributes : {
                  status: status,
                  log: log,
                  policy: policy,
                  timestamp: Date(),
                },
                id: uuid.v4(),
                type: "reports"
            }]
          }
        })
        this._log.info(`sending message: ${JSON.stringify(message)}`)
        if (!this.isTerminated) this.push(message)
      }, 5000)
    }
  }
}

module.exports = RandomStream
