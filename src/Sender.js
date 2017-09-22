export default class Sender
{
  constructor(target=window.parent, origin='*') {
    this.target = target;
    this.origin = origin;
    this.resolvers = Object.create(null);

    this.response = this.response.bind(this);
    window.addEventListener('message', this.response)
  }

  destroy() {
    window.removeEventListener('message', this.response);
  }

  send(data) {
    let promise = new Promise((resolve, reject) => {
      this.resolvers[data.type] = {
        "resolve": resolve,
        "reject": reject
      }
    });

    this.target.postMessage(data, "*");

    return promise;
  }

  response(e) {
    var origin = event.origin || event.originalEvent.origin;
    if(this.origin != '*' && origin != this.origin) return;
    
    let resolver = this.resolvers[e.data.type];
    // Only resolve on the response event.
    if(resolver && e.data.isResponse) {
      delete this.resolvers[e.data.type]
      resolver.resolve(e.data)
    }
  }


  













}