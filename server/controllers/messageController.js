const MessageModel = require('../models/msgModel')

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    console.log(from, to, message);

    const data = await MessageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from
    })
    if (data) {
      return res.json({ msg: "Message added successfully.", status: true })
    }
    return res.json({ msg: "Failed to add message to the databse." })
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
}

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await MessageModel.find({
      users: {
        $all: [from, to]
      }
    })
      .sort({ updatedAt: 1 })
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text
      }
    })
    res.json(projectedMessages);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
}