const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const jwtAuthMiddleware = require("../../lib/jwtAuthMiddleware");
const { Conversation } = require("../../models");

router.get("/:userId", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const chat = await Conversation.find({ users: userId });
    if (!chat) {
      const error = createError(401, "This user do not have conversations");
      next(error);
      return;
    }
    console.log(chat);
  } catch (error) {
    next(createError(500, error));
  }
});

// router.get("/conversation", jwtAuthMiddleware, async (req, res, next) => {
//   try {
//     const advertisement = req.query.advertisement;
//     console.log(advertisement);
//     const conversation = await Conversation.findOne({
//       advertisement,
//       //users: { $all: users },
//     });

//     if (!conversation) {
//       const error = createError(428, "This conversation do not exist");
//       next(error);
//       return;
//     }

//     res.status(200).json(conversation);
//   } catch (error) {
//     next(createError(500, error));
//   }
// });

router.post("/conversation", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const { advertisement, users } = req.body;
    const newConversation = {
      advertisement,
      users,
      messages: [],
    };
    const conversationCreated = new Conversation(newConversation);
    console.log(conversationCreated);
    const conversationSaved = await conversationCreated.save();
    res.status(200).json(conversationSaved);
  } catch (error) {
    next(createError(500, error));
  }
});

module.exports = router;
