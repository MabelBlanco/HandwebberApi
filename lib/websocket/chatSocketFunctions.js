const { Conversation } = require("../../models");
const eventEmitter = require("../eventEmitter").eventEmitter;
const events = require("../eventEmitter").Events;

async function getConversation(data) {
  try {
    const conversation = await Conversation.findOne({
      advertisement: data.advertisement,
      users: { $all: data.users },
    });
    if (!conversation) {
      const newConversation = {
        advertisement: data.advertisement,
        users: data.users,
        messages: [],
      };
      const conversationCreated = new Conversation(newConversation);
      console.log("Se ha creado una nueva conversación", conversationCreated);
      const conversationSaved = await conversationCreated.save();
      eventEmitter.emit(events.NEW_CONVERSATION, conversationSaved);
      console.log(
        "Esta es la nueva conversación ya guardada: ",
        conversationSaved
      );
      return conversationSaved;
    } else {
      return conversation;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteDuplicateConversation(data) {
  const conversations = await Conversation.find({
    advertisement: data.advertisement,
    users: { $all: data.users },
  });

  if (conversations.length > 1) {
    const conversationDelete = await Conversation.deleteOne({
      _id: conversations[1]._id,
    });
    console.log(
      "Se ha borrado una conversación duplicada: ",
      conversationDelete
    );
  }
}

async function deleteConversation(conversationId) {
  const conversationDeleted = await Conversation.findOneAndDelete({
    _id: conversationId,
  });
  return conversationDeleted;
}

async function saveNewMessage(message) {
  const conversation = await Conversation.findOne({
    _id: message.conversationId,
  });

  const newMessages = [...conversation.messages, message.message];

  const newConversation = await Conversation.findOneAndUpdate(
    { _id: message.conversationId },
    { messages: newMessages },
    { new: true }
  );

  return newConversation;
}

module.exports = {
  getConversation,
  deleteDuplicateConversation,
  saveNewMessage,
  deleteConversation,
};
