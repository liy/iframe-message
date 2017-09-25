export default class Receiver
{
  constructor() {
    this.invokers = Object.create(null);

    this.receive = this.receive.bind(this);
    window.addEventListener('message', this.receive)
  }

  destroy() {
    window.removeEventListener('message', this.receive)
  }

  on(type, action) {
    this.invokers[type] = action;
  }

  async receive(e) {
    let action = this.invokers[e.data.type];
    // do not respond the response... recursively...
    if(action && !e.data.isResponse) {
      await new Promise((resolve, reject) => {
        action(e.data, resolve, reject);
      });
      console.log('done!!')
      // Note that I created a new data. Because if message is passed
      // in the same window, the event is a reference of the original event.
      // Original event should not be modified. 
      e.source.postMessage({
        ...e.data,
        isResponse: true,

        // TODO: add origin to lock it down!
      }, "*");
    }
  }
}