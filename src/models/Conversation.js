import {model, staticMethod} from 'utils/mongoose';

@model
class Conversation {

  static schema = {
    sessionId: {type: String, unique: true, required: true},
    messages: {
      type: [{
        sender: {type: String, enum: ['bot', 'user'], required: true},
        // type: {type: String, enum: ['text', 'card'], required: true},
        text: {type: String}, // TODO other message types
        timestamp: {type: Date, default: Date.now},
        entities: {type: Object, default: {}},
      }],
      default: [],
    },
    createdAt: {type: Date, default: Date.now},
  }

  @staticMethod
  static async findOneOrCreate(query, newDoc = query) {
    let conversation = await this.findOne(query);
    if (!conversation) {
      conversation = new this(newDoc);
      await conversation.save();
    }
    return conversation;
  }

}

export default Conversation;