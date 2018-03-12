const {Readable} = require('stream');
const sse = require('sse-utils');
const uuid = require('uuid');

class RandomStream extends Readable {
  constructor (log) {
    super({ objectMode: true });
    this._log = log;
    this.isTerminated = false
  }

  terminate () {
    this.isTerminated = true;
    clearInterval(this.looper)
  }

  _read () {
    let i = 0;
    if (this.isTerminated) return this.push(null);
    if (!this.looper) {
      this.looper = setInterval(() => {

        const event = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random()*26)];
        const statuses = ['ok', 'error'];
        let status;
        if(i%10 == 0) {
          status = statuses[1];
        }
        else{
          status = statuses[0];
        }
        i++;
        const purpose = ['accounting', 'administration', 'charity', 'tourist'][Math.floor(Math.random()*4)];
        const attributes = [["birth_date", "location"], ["browsing_history", "location"], ["degree", "location"]][Math.floor(Math.random()*3)];
        const user = '0123456789'.split('')[Math.floor(Math.random()*10)] +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random()*26)] +
            '0123456789'.split('')[Math.floor(Math.random()*10)] +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random()*26)];
        const policy = "Policy " +
            '0123456789'.split('')[Math.floor(Math.random()*10)] +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.floor(Math.random()*26)];
        var log = `Event ${event} complied with the policy set by user ${user}`;
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
                  status,
                  attributes,
                  purpose,
                  log,
                  policy,
                  timestamp: new Date()
                },
                id: uuid.v4(),
                type: "reports"
            }]
          }
        });
        this._log.info(`sending message: ${JSON.stringify(message)}`);
        if (!this.isTerminated) this.push(message)
      }, 1000)
    }
  }
}

module.exports = RandomStream;
