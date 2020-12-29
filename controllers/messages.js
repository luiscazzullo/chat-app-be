const Message = require('../models/message');

const getChatMessages = async (req, res) => {

  const myId = req.uid;
  const messagesFrom = req.params.from;
  const last30Messages = await Message.find({
    $or: [
      { from: myId, to: messagesFrom },
      { from: messagesFrom, to: myId}
    ]
  }).sort({ createdAt: 'asc' }).limit(30)

  res.json({
    ok: true,
    messages: last30Messages
  })
}

module.exports = {
  getChatMessages
}