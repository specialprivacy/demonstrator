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

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  _read () {
    let i = 0;
    if (this.isTerminated) return this.push(null);
    if (!this.looper) {
      this.looper = setInterval(() => {

        const event = uuid.v4();
        const statuses = ['ok', 'error'];
        let status;
        if(i%10 == 0) {
          status = statuses[1];
        }
        else{
          status = statuses[0];
        }
        i++;
        const purpose = ['lifestyle', 'nutrition', 'activities'][Math.floor(Math.random()*3)];
        const attributes = [["heart_rate"],["age", "calories"], ["calories", "location"], ["age", "heart_rate"], ["age", "calories", "heart_rate", "location"]][Math.floor(Math.random()*5)];
        const user = uuid.v4();
        const policy = uuid.v4();

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
                  user,
                  event,
                  attributes,
                  purpose,
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
