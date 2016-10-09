import EventsHandler from 'channels/facebook/EventsHandler';

class FacebookCtrl {

  constructor(config, middleware) {
    this.config = config;
    this.verifySignature = middleware.xHubSignature(config.facebookAppSecret);
  }

  routes(koa) {
    koa.get('/facebook', ::this.verifyToken);
    koa.post('/facebook', this.verifySignature, ::this.webhook);
  }

  async verifyToken(ctx) {
    log.silly('verifying token');

    if (ctx.query['hub.mode'] !== 'subscribe') {
      const errMsg = 'unknown hub.mode: ' + ctx.query['hub.mode'];
      log.silly(errMsg);
      ctx.throw(400, errMsg);
    }

    const tokenExpected = this.config.facebookVerifyToken;
    const tokenReceived = ctx.query['hub.verify_token'];

    if (tokenReceived !== tokenExpected) {
      const errMsg = 'validation failed, expected ' + tokenExpected + ' but got ' + tokenReceived;
      log.silly(errMsg); // TODO automatically log all ctx responses as silly
      ctx.throw(400, errMsg);
    }

    log.silly('sending body: ' + ctx.query['hub.challenge']);
    ctx.body = ctx.query['hub.challenge'];
  }

  async webhook(ctx) {
    log.silly('facebook webhook');

    const body = ctx.request.body;
    if (body.object !== 'page') {
      ctx.throw(400, 'unknown object type: ' + body.object);
    }

    try {
      const eventsBySenderId = this.entriesToGroupedEvents(body.entry);
      const eventsHandler = new EventsHandler(this.config);

      const tasks = Object
        .entries(eventsBySenderId)
        .map(async ([senderId, events]) => {
          await eventsHandler.process(senderId, events);
        });

      await Promise.all(tasks);
    } catch (ex) {
      log.error('error in webhook endpoint:', ex);
    }

    ctx.body = 'ok';
  }

  entriesToGroupedEvents(entries) {
    return entries
      .map((entry) => entry.messaging)
      .reduce((acc, entry) => acc.concat.apply(acc, entry), [])
      .reduce((acc, event) => {
        const senderId = event.sender.id;
        if (!Array.isArray(acc[senderId])) {
          acc[senderId] = [];
        }
        acc[senderId].push(event);
        return acc;
      }, {});
  }

}

export default FacebookCtrl;
