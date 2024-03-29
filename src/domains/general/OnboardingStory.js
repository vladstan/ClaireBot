import OnboardingActions from 'domains/general/OnboardingActions';
import FacebookApi from 'domains/core/FacebookApi';

import Config from 'server/Config';
import StoryUser from 'ai/StoryUser';

import BotPast from 'ai/bot/BotPast';
import BotInterface from 'ai/bot/BotInterface';

class OnboardingStory {

  onboardingActions: OnboardingActions;
  user: StoryUser;

  constructor(config: Config, user: StoryUser) {
    const facebookApi = FacebookApi.getInstance(config);
    this.onboardingActions = new OnboardingActions(facebookApi);

    // this.define(user);
    this.user = user;
  }

  async run(past: BotPast, context: Object, entities: Object, bot: BotInterface) {}

  async postback(past: BotPast, context: Object, postbackId: string, bot: BotInterface) {
    log.debug('Postback Onboarding with context', JSON.stringify(context));
    const userFbProfile = await this.onboardingActions.getUser(context.facebookSenderId, ['first_name']);
    switch (postbackId) {
      case 'GET_STARTED':
        bot.sayText(`Hi ${userFbProfile.first_name}, I'm Claire your personal concierge for your stay in Palma de Mallorca`);
        bot.sayText('You can use me for free during your stay on the island');
        bot.sayText('Let me show you want I can do for you')
          .quickReply('Ok, let\'s start', 'ONBOARDING_POSTCARDS');
        return true;

      case 'ONBOARDING_POSTCARDS':
        bot.sayText('You can send printed postacards to loved ones.');
        bot.sayText('Just type \'Send a postacard\' to get started')
          .quickReply('Send a postcard', 'DUMMY')
          .quickReply('What else', 'ONBOARDING_ACTIVITIES');
        return true;

      case 'ONBOARDING_ACTIVITIES':
        bot.sayText('You can discover the best activities you can do on the island');
        bot.sayText('Just type: \'Find me an activity\' to get started')
          .quickReply('Find me an activity', 'DUMMY')
          .quickReply('Ok, what else', 'ONBOARDING_REAL_ESTATE');
        return true;

      case 'ONBOARDING_REAL_ESTATE':
        bot.sayText('You can rent or buy properties on the Island')
          .quickReply('Rent an apartment', 'DUMMY')
          .quickReply('Buy a house', 'DUMMY')
          .quickReply('Next one', 'ONBOARDING_RESTAURANTS');
        return true;

      case 'ONBOARDING_RESTAURANTS':
        bot.sayText('You can find the best restaurants, cofeeshops or clubs on the island');
        bot.sayText('Just type: \'Find me the best club or restaurant or coffee\' to get started')
          .quickReply('Find me a club', 'DUMMY')
          .quickReply('Find a restaurant', 'DUMMY')
          .quickReply('Not now, what else', 'ONBOARDING_SHUTLLE');
        return true;

      case 'ONBOARDING_SHUTLLE':
        bot.sayText('I can find you a shuttle for the airport');
        bot.sayText('Just type: \'I want a shuttle\' to get started')
          .quickReply('Airport shuttle', 'DUMMY')
          .quickReply('What else', 'ONBOARDING_FEEDBACK');
        return true;

      case 'ONBOARDING_FEEDBACK':
        bot.sayText('Type \'help\' to see what cool things I can do');
        bot.sayText('If you have any feedback for us just let me know.');
        return true;

      case 'ONBOARDING_HUMAN':
        bot.sayText('Ok, someone in our team will get in touch with you ASAP')
          .quickReply('List the activities', 'ONBOARDING_LIST');
        bot.addActionMessage({
          messageText: 'Talk to a human',
        });
        return true;

      case 'ONBOARDING_LIST':
        bot.sayText('Type one of these things I can do for you to start');
        bot.sayText('I want to send a postcard');
        bot.sayText('What\'s the weather in {location}');
        bot.sayText('I want to rent or buy an apartment');
        bot.sayText('Find a restaurant / club or coffeeshop');
        bot.sayText('Find me an airport shuttle');
        bot.sayText('Find me activity or things to do on the island');
        bot.sayText('Enjoy <3 Palma');
        return true;

      // case 'REENGAGE_DAY_1':
      //   bot.sayText('Day 1!!')
      //     .quickReply('Ok', 'OK');
      //   return true;
    }
  }

}

export default OnboardingStory;
