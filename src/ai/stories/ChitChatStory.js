import Config from 'server/Config';
import StoryUser from 'ai/StoryUser';

import BotPast from 'ai/bot/BotPast';
import BotInterface from 'ai/bot/BotInterface';

class ChitChatStory {

  user: StoryUser;

  constructor(config: Config, user: StoryUser) {
    this.define(user);
    this.user = user;
  }

  define(user: StoryUser) {
    user.says('(Hello|Hi|Hey)')
      .intent('greeting');
  }

  async run(past: BotPast, context: Object, entities: Object, bot: BotInterface) {
    if (entities.intent[0]) {
      context.intent = entities.intent[0].value;
    }

    if (context.intent === 'greeting') {

    }
  }

  async postback(past: BotPast, context: Object, postbackId: string, bot: BotInterface) {} // TODO remove empty calls (super)

}

export default ChitChatStory;
