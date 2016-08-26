import TextMessage from 'channels/facebook/messages/TextMessage';
import GenericMessage from 'channels/facebook/messages/GenericMessage';
import ImageMessage from 'channels/facebook/messages/ImageMessage';

class EventReceiver {

  async receive({message, postback}, reply, bot) {
    await reply.actions('mark_seen', 'typing_on');

    const fbReplies = [];
    const botResponses = [];

    if (message.quick_reply && message.quick_reply.payload) {
      const responses = await bot.postback(message.quick_reply.payload);
      botResponses.push(...responses);
    }

    if (!botResponses.length && message.text) {
      const responses = await bot.process(message.text);
      botResponses.push(...responses);
    }

    if (!botResponses.length && postback.payload) {
      const responses = await bot.postback(postback.payload);
      botResponses.push(...responses);
    }

    if (!botResponses.length && message.attachments) {
      // TODO message.attachments
    }

    if (botResponses.length) {
      botResponses
        .filter((resp) => resp.type === 'text')
        .forEach((resp) => {
          let qr = new TextMessage(resp.text);
          if (Array.isArray(resp.quickReplies)) {
            for (const quickReply of resp.quickReplies) {
              qr = qr.addQuickReply(quickReply.text, quickReply.postbackId);
            }
          }
          fbReplies.push(qr);
        });

      botResponses
        .filter((resp) => resp.type === 'image')
        .forEach((resp) => {
          fbReplies.push(new ImageMessage(resp.url));
        });

      const genericReply = botResponses
        .filter((resp) => resp.type === 'card')
        .reduce((genericMessage, resp) => {
          return genericMessage
            .addBubble(resp.name, resp.description.substr(0, 80))
            .addUrl(resp.url)
            .addImage(resp.img)
            .addButton(resp.button, resp.url)
            .addButton('Talk to a human', 'ONBOARDING_HUMAN');
        }, new GenericMessage()); // TODO send them as a single botResponse
      if (genericReply.bubbles.length) {
        fbReplies.push(genericReply);
      }

      if (fbReplies.length) {
        await reply.messages(...fbReplies);
        return;
      }
    }

    const fallbackTextMsg = new TextMessage("For special requests please type 'Talk to a human'");
    await reply.messages(fallbackTextMsg);
  }

}

export default EventReceiver;