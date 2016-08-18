import TextMessage from 'facebook/messages/TextMessage';
import GenericMessage from 'facebook/messages/GenericMessage';

class MessageReceiver {

  async receive(event, reply, bot) {
    const message = event.message;
    await reply.actions('mark_seen', 'typing_on');

    const fbReplies = [];

    if (message.text) {
      const botReplies = await bot.process(message.text);

      botReplies
        .filter((msg) => msg.type === 'text')
        .forEach((msg) => {
          let qr = new TextMessage(msg.text);
          for (const quickReply of msg.quickReplies) {
            qr = qr.addQuickReply(quickReply.text, quickReply.postbackId);
          }
          fbReplies.push(qr);
        });

      const genericReply = botReplies
        .filter((msg) => msg.type === 'card')
        .reduce((genericMessage, msg) => {
          return genericMessage
            .addBubble(msg.name, msg.description.substr(0, 80))
            .addUrl(msg.url)
            .addImage(msg.img)
            .addButton('I <3 this', 'DEV_LOVE_THIS')
            .addButton('Call an Agent', 'DEV_CALL_AGENT');
        }, new GenericMessage()); // TODO send them as a single botResponse

      if (genericReply.bubbles.length) {
        fbReplies.push(genericReply);
      }

      await reply.messages(...fbReplies);
      return;
    }

    // if (message.attachments) {
    //
    // }

    const fallbackTextMsg = new TextMessage("Ops, I'm lost...");
    await reply.messages(fallbackTextMsg);
  }

}

export default MessageReceiver;
