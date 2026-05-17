const EventEmitter = require('events');

class InMemoryQueue extends EventEmitter {
  async add(name, data) {
    // Process the job asynchronously on the next tick so it doesn't block the request loop
    setImmediate(() => {
      this.emit('job', { name, data });
    });
    return { id: Math.random().toString(36).substring(2, 9) };
  }
}

const emailQueue = new InMemoryQueue();

module.exports = {
  emailQueue,
};
