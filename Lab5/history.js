const events = require("events");

class History extends events.EventEmitter {
  constructor() {
    super();
    this.isLog = false;
    this.startTime = null;
    this.endTime = null;
    this.req = 0;
    this.commits = 0;
  }

  startWathing() {
    this.isLog = true;
    this.startTime = new Date();
    this.endTime = null;
    this.req = 0;
    this.commits = 0;
  }

  onReq() {
    if (this.isLog) {
      this.req++;
    }
  }

  onCommit() {
    if (this.isLog) {
      this.commits++;
    }
  }

  endWathing() {
    this.isLog = false;
    this.endTime = new Date();
  }
}

const history = new History();
history.on("Commit", () => {
  history.onCommit();
});
history.on("Request", () => {
  history.onReq();
});
history.on("Start", () => {
  history.startWathing();
});
history.on("End", () => {
  history.endWathing();
});

exports.history = history;
