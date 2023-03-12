const mongoose = require("mongoose");

//Schema
const conversationSchema = mongoose.Schema({
  advertisement: { type: String, unique: false, required: true },
  users: { type: [String], unique: false, required: true },
  messages: [
    {
      from: String,
      body: String,
      date: { type: Date, default: Date.now },
      read: Boolean,
    },
  ],
});

//DB indexes
userSchema.index({ advertisement: 1 });
userSchema.index({ advertisement: -1 });
userSchema.index({ users: 1 });
userSchema.index({ users: -1 });

//Create Model
const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

//Exportar modelo
module.exports = Conversation;
