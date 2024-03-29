import TextMessage from 'channels/facebook/messages/TextMessage';
import FacebookReply from 'channels/facebook/FacebookReply';

import Message from 'models/Message';

class MessagesCtrl {

  constructor(config) {
    this.config = config;
    this.facebookReply = new FacebookReply(config);
  }

  routes(koa) {
    koa.post('/messages', ::this.sendMessages);
  }

  async sendMessages(ctx) {
    log.silly('sending message');

    const body = ctx.request.body;
    if (!body) ctx.throw(400, 'body required');
    if (!body.messages) ctx.throw(400, 'body.messages is required');
    // TODO use a validation lib?

    log.silly('sendMessage: validation successful, processing messages...');
    for (const message of body.messages) {
      log.silly('sendMessage: setting recipientId');
      this.facebookReply.setRecipientId(message.receiverId);

      log.silly('sendMessage: sending to Facebook');
      await this.facebookReply.messages(new TextMessage(message.text)); // eslint-disable-line babel/no-await-in-loop

      log.silly('sendMessage: saving to db');
      await new Message(message).save(); // eslint-disable-line babel/no-await-in-loop
    }

    ctx.body = 'ok';
  }

}

export default MessagesCtrl;
